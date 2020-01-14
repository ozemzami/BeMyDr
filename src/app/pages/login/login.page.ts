import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertService } from 'src/app/services/alert.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';
  validationMessages = {
    email: [
      { type: 'required', message: 'Please enter your email.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Please enter your password.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor( private loginService: LoginService,
               private formBuilder: FormBuilder,
               public navCtrl: NavController,
               private storage: Storage,
               private alertService: AlertService ) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }
  loginUser(value) {
    this.loginService.loginUser(value)
    .then(res => {
      this.getProfile()
      this.storage.set('allowed', true);
      console.log(res);
      this.errorMessage = '';
      this.navCtrl.navigateForward('/menu/home');
      this.alertService.presentToast("Logged In");
    }, err => {
      this.errorMessage = err.message;
      this.alertService.presentToast(this.errorMessage);
    });
  }

  goToRegister(){
    this.navCtrl.navigateForward('/register');
  }
  getProfile(){
    const currentUser = this.loginService.userDetails()
    firebase.database().ref(`/${currentUser.uid}`).once('value').then( (snapshot) => {
      const val = snapshot.val()
      var profile = {
        id : currentUser.uid,
        picture : '../../../assets/boss.png',
        name : val.infos.firstname + ' ' + val.infos.lastname
      }
      this.storage.set('profile', profile);
    })
  }

}
