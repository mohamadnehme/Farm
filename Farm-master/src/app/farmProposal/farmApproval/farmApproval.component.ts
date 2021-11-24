import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { IUser } from 'src/app/shared/models/user';
import { ShopService } from 'src/app/shop/shop.service';

@Component({
  selector: 'app-farmApproval',
  templateUrl: './farmApproval.component.html',
  styleUrls: ['./farmApproval.component.scss']
})
export class FarmApprovalComponent implements OnInit {

  currentUser$: Observable<IUser>;
  farms: any[];
  constructor(public shopService: ShopService, private accountService: AccountService) { }

  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$
    this.shopService.getFarmProposalsA().subscribe((res: any) => {
      this.farms = res.farms;
    })
  }
  logout(){
    this.accountService.logout();
  }
}
