import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { OrdersService } from '../orders/orders.service';
import { IOrder } from '../shared/models/order';
import { IUser } from '../shared/models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  totalInterest = 0;
  totalInvest = 0;
  totalExpect = 0;

  orders: any[];
  currentUser$: Observable<IUser>;
  constructor(public accountService: AccountService, private orderService: OrdersService) { }

  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$;
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrdersForUser().subscribe((orders: any[]) => {
      this.orders = orders;
      console.log(orders);

      orders.forEach(element => {
        this.totalInterest += element.orderItems[0].interest * element.orderItems[0].quantity;
        this.totalInvest += element.orderItems[0].price * element.orderItems[0].quantity;
      });
      this.totalExpect += this.totalInterest + this.totalInvest;
    }, error => {
      console.log(error);
    })
  }

}
