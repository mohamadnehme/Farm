import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';
import { IUser } from '../shared/models/user';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  constructor(private http: HttpClient, public shopService: ShopService, private accountService: AccountService) { }

  navbarOpen = false;

  currentUser$: Observable<IUser>;

  users: any[];
  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$
    this.http.get(environment.apiUrl + "account/users").subscribe((res: any) => {
      this.users = res;
    })
  }

  logout(){
    this.accountService.logout();
  }

}
