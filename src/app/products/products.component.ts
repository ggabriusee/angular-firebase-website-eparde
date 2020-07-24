import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { Subscription, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

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
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductService,
    private cartService: ShoppingCartService) {}

  async ngOnInit() {
    // onInit because constructor canot be async
    this.cart$ = await this.cartService.getCart();
    this.populateProducts();
  }

  private populateProducts(){
    this.productSub = this.productsService.getAll().pipe(switchMap(products => {
      this.products = products;
      return this.route.queryParamMap;
    })).subscribe(params =>{
      this.category = params.get('category');
      this.applyFilter();
      });
  }

  private applyFilter(){
    this.filteredProducts = this.category ? 
    this.products.filter(p => p.category === this.category) : 
    this.products;
  }

  ngOnDestroy(){
    this.productSub.unsubscribe();
  }

}
