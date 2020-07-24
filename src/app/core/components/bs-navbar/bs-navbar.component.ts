import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'shared/services/auth.service';
import { AppUser } from 'shared/models/app-user';
import { Subscription, Observable } from 'rxjs';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit, OnDestroy{
  appUser: AppUser;
  appUserSub: Subscription;
  cart$: Observable<ShoppingCart>;

  constructor(private auth: AuthService, private cartService: ShoppingCartService){}

  logout(){
    this.auth.logout();
  }

  async ngOnInit(){
    this.appUserSub = this.auth.appUser$.subscribe(appUser => this.appUser = appUser);
    this.cart$ = await this.cartService.getCart();
  }

  ngOnDestroy(){
    //in theory this is required, but in practise it's not nessesary
    //this navbar component will only have one instance of it in the DOM
    //and only one subscribtion through out the whole lifetime of the application
    //so no memory leaks, when user exists from app, subscribtion closes.
    this.appUserSub.unsubscribe();
  }


}
