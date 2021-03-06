import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {


  histories = [];
  dates = [];
  history= [];
  date: string;
  opened: boolean;

  constructor( private historyService: HistoryService , public navCtrl: NavController) { }

  ngOnInit() {
    var currentUser = firebase.auth().currentUser
    if(currentUser === null){
      this.navCtrl.navigateForward('/login');
    }
    this.opened = false
    this.historyService.getUserData().then(res => {
      var results = res;
      this.dates = Object.keys(results);
      var i;
      var date;
      for(i = 0; i < this.dates.length; i++) {
        date = this.dates[i];
        this.histories.push(results[date])
      }
      console.log(this.histories)
      console.log(this.dates)
    });
  }

  open( index) {
    var res = this.histories[index];
    var key = Object.keys(res);
    this.history = res[key[0]]
    this.history.forEach(element => {
      var probability = element.probability * 100
      element.probability = probability + '%';
    });
    console.log(this.history)
    this.date = this.dates[index];
    this.opened = true

  }
  back(){
    this.opened = false
  }

  public logOut(){
    this.navCtrl.navigateForward('/login');
  }

}
