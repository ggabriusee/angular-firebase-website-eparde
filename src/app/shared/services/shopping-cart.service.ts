import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Product } from 'shared/models/product';
import { take, map } from 'rxjs/operators';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>>{
    let id = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + id).snapshotChanges().pipe(map( 
      x => new ShoppingCart(x.payload.child('/items').val())));
  }

  async addToCart(product: Product){
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product){
    this.updateItem(product, -1);
  }

  async clearCart(){
    let cartid = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartid + '/items').remove();
  }

  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime() 
    });
  }

  private getItem(cartId:string, productId: string){
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
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

  private async updateItem(product: Product, change: number){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.id);
    item$.snapshotChanges().pipe(take(1))
    .subscribe( item => {
      let quantity = (item.payload.child('/quantity').val() || 0) + change;
      if (quantity === 0) item$.remove();
      else item$.update({
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: quantity
      });
    });
  }
}
