import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  photo : String;
  name : String;

  constructor(public navCtrl: NavController, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('profile').then((val) => {
      this.photo = val.picture
      this.name = val.name
    });
  }


  public logOut(){
    this.navCtrl.navigateForward('/login');
  }

}
