import { Component, OnInit } from '@angular/core';
import { IProduct } from './shared/models/product';
import { HttpClient } from '@angular/common/http';
import { IPagination } from './shared/models/pagination';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';
import { Observable } from 'rxjs';
import { IUser } from './shared/models/user';
import { ShopService } from './shop/shop.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Skinet';
  currentUser$: Observable<IUser>;
  navbarOpen = false;
  signin;
  signup;
  logout(){
    this.accountService.logout();
  }

  constructor(private basketService: BasketService, private accountService: AccountService, public shopService: ShopService) { }

  ngOnInit(): void {
    this.accountService.signin.subscribe(res => {
      this.signin = res;
    });
    this.accountService.signup.subscribe(res => {
      this.signup = res;
    });

    this.loadBasket();
    this.loadCurrentUser();
    this.currentUser$ = this.accountService.currentUser$;
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token!).subscribe(() => {
      console.log('loaded user');
    }, error => {
      console.log(error);
    })
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe(() => {
        console.log('initialised basket');
      }, error => {
        console.log(error);
      })
    }
  }

}
