import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { IUser } from '../shared/models/user';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit, OnDestroy{

  constructor(public shopService: ShopService, private accountService: AccountService) { }

  currentUser$: Observable<IUser>;
  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$
    this.shopService.ishome = true;
  }

  ngOnDestroy(): void {
    this.shopService.ishome = false;
  }

  logout(){
    this.accountService.logout();
  }

}
