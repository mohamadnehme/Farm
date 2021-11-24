import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { IUser } from '../shared/models/user';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit, OnDestroy {

  constructor(public shopService: ShopService, private accountService: AccountService ,private toast: ToastrService) { }

  currentUser$: Observable<IUser>;
  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$;
    this.shopService.ishome = true;
  }

  ngOnDestroy(): void {
    this.shopService.ishome = false;
  }
  logout(){
    this.accountService.logout();
  }
  test(){
    this.toast.success("message has sended");
  }
}
