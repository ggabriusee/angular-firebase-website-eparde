import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  private authSubscribtion: Subscription;
  
  constructor(private userService: UserService, private auth: AuthService, private router: Router){
    this.authSubscribtion = auth.user$.subscribe(user => {
      if (user){
        userService.save(user); // should be in registration, but now we get up to date data
        router.navigateByUrl(localStorage.getItem('returnUrl'));
      }
    });
  }

  ngOnDestroy(){
    //in theory this is required, but in practise it's not nessesary
    //this app.component is the root component,
    //so there will only be one instance of it in the DOM
    //and only one subscribtion through out the whole lifetime of the application
    //so no memory leaks, when user exists from app, subscribtion closes.
    this.authSubscribtion.unsubscribe();
  }
}
