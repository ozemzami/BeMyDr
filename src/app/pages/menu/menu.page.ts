import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home'
    },
    {
      title: 'Profile',
      url: '/menu/profile',
      icon: 'person'
    },
    {
      title: 'History',
      url: '/menu/history',
      icon: 'time'
    },{
      title: 'Summary',
      url: '/menu/recap',
      icon: 'list-box'
    },
    {
      title: 'Settings',
      url: '/menu/settings',
      icon: 'settings'
    }
  ];
  selectedPath = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event : RouterEvent) => {
      this.selectedPath = event.url;
    })
   }

  ngOnInit() {
  }

}
