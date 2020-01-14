import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ChatbotService, Message } from '../../services/chatbot.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { LoginService } from '../../services/login.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;
  allowed: boolean;


  constructor(
    private navCtrl: NavController,
    private chat: ChatbotService,
    private speechRecognition: SpeechRecognition,
    private platform: Platform,
    private storage: Storage,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const currentUser = this.loginService.userDetails()
    this.storage.get('allowed').then((val) => {
      console.log(val)
      this.allowed = val
    });
    if (this.platform.is('cordova')) {
      this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission()
            .then(
              () => console.log('Granted'),
              () => console.log('Denied')
            );
        }
      });
    }
    if(currentUser === null){
      this.navCtrl.navigateForward('/login');
    }
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation
      .asObservable()
      .pipe(
        scan((acc, val) => acc.concat(val))
      )
  }

  start() {
    this.speechRecognition.startListening()
      .subscribe(
        (matches: Array<string>) => {
          console.log(matches);
          this.formValue = matches[0];
          this.chat.converse(this.formValue);
          this.formValue = '';
        }
      );
  }
  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
    console.log(this.chat.conversation)
  }


  public logOut(){
    this.navCtrl.navigateForward('/login');
  }



}
