import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'shared/services/category.service';
import { ProductService } from 'shared/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
// to take only one value from observable and close it, so no need to unsubscribe
import { take } from 'rxjs/operators'; 
import { Product } from 'shared/models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  categories$;
  product: Product= {};
  private productId;

  constructor(
    private router: Router,
    private route: ActivatedRoute, // to read the rout parameters
    private categoryService: CategoryService, 
    private productService: ProductService) {

    this.categories$ = categoryService.getAll();
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) 
      this.productService.getOne(this.productId).valueChanges()
      .pipe(take(1)).subscribe( (p: Product) => this.product = p);
   }

   save(product){
     //console.log(product);
     if (this.productId)
      this.productService.update(this.productId, product);
    else
      this.productService.create(product);
    this.router.navigate(['/admin/products']);
   }

   delete(){
     if (confirm('Are you sure you want to delete this product?')){
       this.productService.delete(this.productId);
       this.router.navigate(['/admin/products']);
     }
   }

  ngOnInit() {
  }

}
