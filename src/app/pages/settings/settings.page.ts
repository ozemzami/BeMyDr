import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserPreferenceService } from '../../services/user-preference.service';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  userData;
  questions: String;
  diagnostics: String;
  saved: boolean 


  constructor(public navCtrl: NavController, private upservice: UserPreferenceService, private storage: Storage, private loginservice: LoginService) {
   }

  ngOnInit() {
    const currentUser = this.loginservice.userDetails()
      firebase.database().ref(`/${currentUser.uid}`).once('value').then( (snapshot) => {
        var val = snapshot.val()
        if( val !== null){
          val = val.infos.user_preferences
          console.log(val)
          this.diagnostics = 'Current value: '+ val.nb_diseases;
          this.questions = 'Current value: '+ val.nb_questions;
          this.saved = true

        }else{
          this.diagnostics = 'not set yet';
          this.questions = 'not set yet';
          this.saved = false
        }
      });
  }


  public save(form){
    const currentUser = this.loginservice.userDetails()
    this.upservice.saveData(form.value , currentUser.uid)
    this.diagnostics = 'Current value: '+ form.value.diagnostics;
    this.questions = 'Current value: '+ form.value.questions;

  }
  public saveUser(form){
    const currentUser = this.loginservice.userDetails()
    this.storage.get('profile').then((val) => {
      this.loginservice.writeUserData(val.given_name, val.family_name, 'email@gmail.com', currentUser.uid, form.value.age, form.value.sexe)
      this.diagnostics = 'Current value: '+ form.value.diagnostics;
      this.questions = 'Current value: '+ form.value.questions;
      this.saved = true

    })

  }


  public logOut(){
    this.navCtrl.navigateForward('/login');
  }

}
