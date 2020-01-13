import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';



export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  readonly token = environment.dialogflow.chatbot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  talk() {
    this.client.textRequest('Hi')
      .then(res => res );
  }

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }
  getUsername() {
    const userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/' + userId).once('value').then((snapshot) => {
      const tmp = JSON.stringify(snapshot.val());
      // return JSON.parse(tmp);
      return userId;
    });
  }

  // Sends and receives messages via dialogflow
  async converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);
    const user = await this.getUsername();
    console.log(user)

    const options = {
      sessionId: 'session______id',
      resetContexts: false,
      contexts: [{
          name: 'suggested_symptoms',
          lifespan: 40,
          parameters: {
            userId: user,
          }
      }]
    };


    return this.client.textRequest(msg,  options)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        console.log(botMessage)
        this.update(botMessage);
      });
  }
}
