import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

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
    //snapshot to also get uid, which is stored in .key and the actual obeject in payload.val()
    return this.db.list('/products').snapshotChanges()
    .pipe(map( (users: any[]) => users.map(user => {
      return { id: user.key, ...user.payload.val() }
    })));
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
