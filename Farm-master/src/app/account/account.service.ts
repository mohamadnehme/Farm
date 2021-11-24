import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, of, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  jwtHelper = new JwtHelperService();
  decodeToken: any;
  signin = new BehaviorSubject<boolean>(false);
  signup = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token:string | null | undefined){

    if(token === null){
      this.currentUserSource.next(null!);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if(user) {
          localStorage.setItem('token', user.token);
          this.decodeToken = this.jwtHelper.decodeToken(user.token);
          user.role = this.decodeToken.role;

          this.currentUserSource.next(user);
        }
      })
    )
  }

  roleMatch(allowedRoles): boolean{
    let isMatch = false;
    const userRoles = this.decodeToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if(userRoles.includes(element)){
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }

  login(values: any){
    return this.http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if(user){
          localStorage.setItem('token', user.token);
          this.decodeToken = this.jwtHelper.decodeToken(user.token);
          user.role = this.decodeToken.role;
          this.currentUserSource.next(user);

        }
      })
    );
  }

  register(values: any){
    return this.http.post<IUser>(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if(user){
          localStorage.setItem('token', user.token);
          user.role = this.decodeToken.role;
          console.log(user.role);

          this.currentUserSource.next(user);
        }
      })
    );
  }

  update(values: any){
    return this.http.put<IUser>(this.baseUrl + 'account/update', values).pipe(
      map((user: IUser) => {
        if(user){
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    this.currentUserSource.next(null!);
    this.router.navigateByUrl('/');
  }

  checkEmailExist(email: string){
    return this.http.get(this.baseUrl + 'account/emailExist?email=' + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  getUser() {
    return this.http.get<any>(this.baseUrl + 'account/user');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }

}
