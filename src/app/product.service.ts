import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db:AngularFireDatabase) { }

  create(product){
    // return thenable ref in case something needs to be done afterwords
    return this.db.list('/products').push(product);
  }

  getAll(){
    return this.db.list('/products').snapshotChanges(); //snapshot to also get uid
  }

  getOne(id){
    return this.db.object('/products/' + id);
  }

  update(id, product){
    return this.db.object('/products/' + id).update(product);
  }

  delete(id){
    return this.db.object('/products/' + id).remove();
  }
}
