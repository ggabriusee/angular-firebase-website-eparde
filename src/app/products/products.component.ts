import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  category;
  productSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductService) {

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

  ngOnInit() {
  }

}
