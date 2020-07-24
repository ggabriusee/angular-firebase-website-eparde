import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase, private cartService: ShoppingCartService) { }

  getOrders(){
    return this.db.list('/orders').valueChanges();
  }

  getOrdersByUser(userId: string){
    return this.db.list('/orders', ref => {
      return ref.orderByChild('userId').equalTo(userId);
    }).valueChanges();
  }

  placeOrder(order){
    /*
    In this implementation, it is possible 
    that the second line (for clearing the cart) 
    fails for some unexpected reason while connecting with Firebase.

    A more reliable approach is to have a transaction. 
    This will ensure that either both these operations succeed together 
    or they both will fail
    (order object is stored AND the corresponding shopping cart is cleared).
    */
    let result = this.db.list('/orders').push(order);
    this.cartService.clearCart();
    return result;
  }
}
