import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class RecapService {

  constructor() { }
  getUserData() {
    const userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/' + userId ).once('value').then((snapshot) => {
      return snapshot.val();
    });
  }
}
