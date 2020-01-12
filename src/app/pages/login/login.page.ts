import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

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

  constructor( private loginService: LoginService,private formBuilder: FormBuilder, public navCtrl: NavController, private storage: Storage ) { }

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
      const currentUser = this.loginService.userDetails()
      var profile = {
        id : currentUser.uid,
        picture : '../../../assets/boss.png',
        name : 'Firebase'
      }
      this.storage.set('profile', profile);
      this.storage.set('auth', 'normale');
      console.log(res);
      this.errorMessage = '';
      this.navCtrl.navigateForward('/menu/home');
    }, err => {
      this.errorMessage = err.message;
    });
  }

  goToRegister(){
    this.navCtrl.navigateForward('/register');
  }

}
