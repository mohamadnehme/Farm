import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { IUser } from 'src/app/shared/models/user';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: IProduct;
  quantity = 1;
  currentUser$: Observable<IUser>;

  constructor(public shopService: ShopService, private accountService: AccountService,private activateRoute: ActivatedRoute,
    private bcService: BreadcrumbService, private basketService: BasketService, private router: Router, private location: Location) {
    this.bcService.set('@productDetails', ' ');
  }

  back(){
    this.location.back();
  }

  ngOnInit(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.loadProduct();
    console.log(this.product);

    this.currentUser$ = this.accountService.currentUser$;
  }

  float2int (value) {
    return value | 0;
  }

  loadProduct(){
    this.shopService.getProduct(+this.activateRoute.snapshot.paramMap.get('id')!).subscribe(product => {
      this.product = product;
      this.bcService.set('@productDetails', product.name);
    }, error => {
      console.log(error);
    });
  }

  createPaymentIntent(product) {
    return this.basketService.createPaymentIntent(product, this.quantity).subscribe((response: any) => {
      this.router.navigateByUrl('/checkout/'+product.id);
    }, error => {
      console.log(error);
    })
  }

  logout(){
    this.accountService.logout();
  }

  incrementQuantity(){
    if(this.quantity < this.product.unitQuantity)
      this.quantity++;
  }

  decrementQuantity(){
    if(this.quantity > 1)
      this.quantity--;
  }
}
