import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { IUser } from 'src/app/shared/models/user';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  @Input() product: IProduct;
  @Output() deleteProduct:any = new EventEmitter();

  currentUser$: Observable<IUser>;
  constructor(private basketService: BasketService, public shopService: ShopService, private accountService: AccountService) { }
  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
  }

  addItemToBasket(){
    this.basketService.addItemToBasket(this.product);
  }
  remove(product){
    this.deleteProduct.emit(product);
  }
}
