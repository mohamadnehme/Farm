import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { IUser } from '../shared/models/user';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , OnDestroy{

  currentUser$: Observable<IUser>;

  constructor(public shopService: ShopService, private accountService: AccountService) { }
  ngOnInit(): void {
    this.shopService.ishome = true;
    this.currentUser$ = this.accountService.currentUser$;
  }

  logout(){
    this.accountService.logout();
  }

  ngOnDestroy(): void {
    this.shopService.ishome = false;
  }
  signin(){
    this.accountService.signin.next(true);
  }
  signup(){
    this.accountService.signup.next(true);
  }
}
