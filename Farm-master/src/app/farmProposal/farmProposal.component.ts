import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { IUser } from '../shared/models/user';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-farmProposal',
  templateUrl: './farmProposal.component.html',
  styleUrls: ['./farmProposal.component.scss']
})
export class FarmProposalComponent implements OnInit {
  currentUser$: Observable<IUser>;
  farms: any[];
  disable = false;
  constructor(public shopService: ShopService, private accountService: AccountService, private toast: ToastrService) { }

  logout(){
    this.accountService.logout();
  }


  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$
    this.shopService.getFarmProposals().subscribe((res: any) => {
      this.farms = res.farms;
      console.log(this.farms);

    })
  }

  send(email, id){
    this.shopService.sendMail(email, id).subscribe((farm: any) => {


      this.farms.forEach((element, index) => {
        if(element.id === farm.id)
        {
          this.farms.splice(index, 1);
          this.toast.success("email has sended");
        }

      })
    })
  }

  reject(farmId){
    this.disable = true;
    this.shopService.reject(farmId).subscribe((farm: any) => {
      this.farms.forEach((element, index) => {

        if(element.id === farm.farm.id){
          this.farms.splice(index, 1);
          this.toast.success("Delete Successfully");
        }

      });
      this.disable = false;
    }, error => {
      this.toast.error(error);
      this.disable = false;
    })
  }
}
