import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/product.service';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product';
import { map } from 'rxjs/operators';
import { DataTableResource } from 'angular7-data-table';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  private products: Product[];
  private prodSubscription: Subscription;
  private tableResource: DataTableResource<Product>;
  items: Product[] = [];
  itemCount: number;

  constructor(private productService: ProductService) {
    this.prodSubscription = this.productService.getAll()
    .subscribe(products => {
      this.products = products;
      this.initDataTable(products);
    });
   }

   private initDataTable(products){
     //init data table object
    this.tableResource = new DataTableResource(products);
    //init items with first page of products in data table
    this.tableResource.query({offset: 0, limit: 10}).then(items => this.items = items);
    // init the number of all items, used to calc pages and stuff
    this.tableResource.count().then(count => this.itemCount = count);
   }

   reloadItems(params){
    if (!this.tableResource) return;

    this.tableResource.query(params).then(items => this.items = items);
   }

   filter(query:string){
     let filteredProducts = query ? 
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) : 
      this.products;

      this.initDataTable(filteredProducts);
   }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.prodSubscription.unsubscribe();
  }

}
