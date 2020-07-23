import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Product } from './models/product';
import { take, map } from 'rxjs/operators';
import { ShoppingCart } from './models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime() 
    });
  }

  private getItem(cartId:string, productId: string){
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  async getCart(): Promise<Observable<ShoppingCart>>{
    let id = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + id).snapshotChanges().pipe(map( 
      x => new ShoppingCart(x.payload.child('/items').val())));
  }
  /*
  private getOrCreateCartId(){
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    this.create().then(result => {
      localStorage.setItem('cartId', result.key);
      return result.key;
    });
  } identical methods, but different implementation 
  */ 
  private async getOrCreateCartId(): Promise<string>{
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;
    
    let result = await this.create(); 
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  async addToCart(product: Product){
    this.updateProductQuantity(product, 1);
  }

  async removeFromCart(product: Product){
    this.updateProductQuantity(product, -1);
  }

  private async updateProductQuantity(product: Product, change: number){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.id);
    item$.snapshotChanges().pipe(take(1))
    .subscribe( item => {
      let quantity = (item.payload.child('/quantity').val() || 0) + change;
      item$.update({product: product, quantity: quantity});
    });
  }
}
