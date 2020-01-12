import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor() { }

  getUserData() {
    const userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/' + userId +'/diagnosis' ).once('value').then((snapshot) => {
      return snapshot.val();
    });
  }
}
