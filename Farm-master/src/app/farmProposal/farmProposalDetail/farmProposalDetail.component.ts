import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { IUser } from 'src/app/shared/models/user';
import { ShopService } from 'src/app/shop/shop.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-farmProposalDetail',
  templateUrl: './farmProposalDetail.component.html',
  styleUrls: ['./farmProposalDetail.component.scss']
})
export class FarmProposalDetailComponent implements OnInit {

  farm: any;
  currentUser$: Observable<IUser>;

  constructor(public shopService: ShopService, private activateRoute: ActivatedRoute,
    private bcService: BreadcrumbService, private accountService: AccountService, private location: Location) { }

  back(){
    this.location.back();
  }
  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$
    this.shopService.getFarmProposal(+this.activateRoute.snapshot.paramMap.get('id')!).subscribe((farm: any) => {
      this.farm = farm.farm;
      console.log(farm);

      this.bcService.set('@productDetails', farm.farmName);
    }, error => {
      console.log(error);
    });
  }

  logout(){
    this.accountService.logout();
  }
}
