import { Injectable } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { AlertService } from './alert.service';

declare var window: any;
 
@Injectable({
 providedIn: 'root'
})
export class LoginService {

  googleId = '136786270315-92k3a7s7t7rpoo3emv0poa9ph1rktpjc.apps.googleusercontent.com';
 
 constructor(private storage: Storage, private platform: Platform,
             public navCtrl: NavController, private fireAuth: AngularFireAuth,private alertService: AlertService
              ) {}
 
 public login() {
   this.platform.ready()
     .then(this.googleLogin)
     .then(success => 
          {
            const { id_token, access_token } = success
            this.onLoginSuccess(id_token, access_token);
          }
     ).catch( (error) => {
       console.error(error);
     });
  };
 public googleLogin(): Promise<any> {
   console.log('136786270315-92k3a7s7t7rpoo3emv0poa9ph1rktpjc.apps.googleusercontent.com')
  return new Promise(function (resolve, reject) {
    const url = 'https://accounts.google.com/o/oauth2/auth?client_id=136786270315-q4mvas9t458gck9rd0suil5qh8645e74.apps.googleusercontent.com' +
      "&redirect_uri=http://localhost:8100/login" +
      "&scope=https://www.googleapis.com/auth/plus.login" +  
      "&response_type=token id_token";
      console.log(window.cordova)
    const browserRef = window.cordova.InAppBrowser.open(
      url,
      "_blank",
      "location=no, clearsessioncache=yes, clearcache=yes"
    );
    let responseParams: string;
    let parsedResponse: Object = {};
    browserRef.addEventListener("loadstart", (evt) => {
      if ((evt.url).indexOf("http://localhost:8100") === 0) {
        browserRef.removeEventListener("exit", (evt) => { });
        browserRef.close();
        console.log(evt);
        responseParams = ((evt.url).split("#")[1]).split("&");
        for (var i = 0; i < responseParams.length; i++) {
          parsedResponse[responseParams[i].split("=")[0]] = responseParams[i].split("=")[1];
        }
        if (parsedResponse["access_token"] !== undefined &&
          parsedResponse["access_token"] !== null) {
          resolve(parsedResponse);
        } else {
          reject("Problème d’authentification avec Google");
        }
      }
    });
    browserRef.addEventListener("exit", function (evt) {
      reject("Une erreur est survenue lors de la tentative de connexion à Google");
    });
  });
}

  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
    this.fireAuth.auth.signInWithCredential(credential)
      .then((response) => {
        console.log(firebase.auth().currentUser);
        console.log(response)
        this.storage.set('profile', response.additionalUserInfo.profile);
        firebase.database().ref(`/${firebase.auth().currentUser.uid}`).once('value').then( (snapshot) => {
          var value = snapshot.val()
          console.log(value)
          if( value === null){
            this.storage.set('allowed', false);
            this.navCtrl.navigateForward('/menu/home');
            this.alertService.presentToast('Logged in');
          }else{
            this.storage.set('allowed', true);
            this.navCtrl.navigateForward('/menu/home');
            this.alertService.presentToast('Logged in');
          }
        });
      })

  }
  onLoginError(err) {
    console.log(err);
    this.alertService.presentToast(err);
  }
  writeUserData(first, last, email, userRecord, old, sexe) {
    firebase.database().ref('/' + userRecord + '/infos').set({
      firstname: first,
      lastname: last,
      mail: email,
      age: old,
      sex: sexe
    });
    firebase.database().ref('/' + userRecord + '/infos/user_preferences').set({
      nb_diseases: 3,
      nb_questions: 9,
    });
  }
  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
         console.log(firebase.auth().currentUser.uid);
         this.writeUserData(value.firstname, value.lastname, value.email, firebase.auth().currentUser.uid, value.old, value.sexe);
         resolve(res);
      })
      .catch(err => {
       reject(err);
    });
   });
  }
  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err));
    });
   }
   logoutUser() {
     return new Promise((resolve, reject) => {
       if (firebase.auth().currentUser) {
         firebase.auth().signOut()
         .then(() => {
           console.log('LOG Out');
           resolve();
         }).catch((error) => {
           reject();
         });
       }
     });
   }
   userDetails() {
     return firebase.auth().currentUser;
   }
}
