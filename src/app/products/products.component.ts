import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy{

  products: Product[] = [];
  filteredProducts: Product[] = [];
  category;
  productSub: Subscription;
  cart: any;
  cartSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductService,
    private cartService: ShoppingCartService) {

    this.productSub = productsService.getAll().pipe(switchMap(products => {
      this.products = products;
      return this.route.queryParamMap;
    })).subscribe(params =>{
      this.category = params.get('category');

      this.filteredProducts = this.category ? 
      this.products.filter(p => p.category === this.category) : 
      this.products;
      });
    
   }

  async ngOnInit() {
    // onInit because constructor canot be async
    this.cartSub = (await this.cartService.getCart())
    .subscribe(cart => this.cart = cart);
  }

  ngOnDestroy(){
    this.cartSub.unsubscribe();
  }

}
