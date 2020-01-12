import { Component, OnInit } from '@angular/core';
import { RecapService } from '../../services/recap.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.page.html',
  styleUrls: ['./recap.page.scss'],
})
export class RecapPage implements OnInit {

  symptoms = [];
  constructor(public navCtrl: NavController, private recapService: RecapService) { }

  ngOnInit() {
    this.recapService.getUserData().then(res => {
      console.log(res)
      var results = res.symptoms;
      var keys = Object.keys(results);
      var i;
      var key;
      for(i = 0; i < keys.length; i++) {
        key = keys[i];
        this.symptoms.push(results[key])
      }
      console.log(this.symptoms)
    });
  }

  public logOut(){
    this.navCtrl.navigateForward('/login');
  }


}
