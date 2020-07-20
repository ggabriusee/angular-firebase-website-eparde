import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppUser } from '../models/app-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnDestroy{
  appUser: AppUser;
  appUserSubscribtion: Subscription;

  constructor(private auth: AuthService){
    this.appUserSubscribtion = auth.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  logout(){
    this.auth.logout();
  }

  ngOnDestroy(){
    //in theory this is required, but in practise it's not nessesary
    //this navbar component will only have one instance of it in the DOM
    //and only one subscribtion through out the whole lifetime of the application
    //so no memory leaks, when user exists from app, subscribtion closes.
    this.appUserSubscribtion.unsubscribe();
  }


}
