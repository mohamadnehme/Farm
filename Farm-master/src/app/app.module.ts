import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { ShopedModule } from './shop/shop.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { HasRoleDirective } from './shared/directives/has-role.directive';
import { AdminComponent } from './admin/admin.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { AlertifyService } from './core/services/alertify.service';
import { UsersComponent } from './users/users.component';
import { FarmProposalComponent } from './farmProposal/farmProposal.component';
import { CreateFarmProposalComponent } from './farmProposal/createFarmProposal/createFarmProposal.component';
import { FarmProposalDetailComponent } from './farmProposal/farmProposalDetail/farmProposalDetail.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { FarmApprovalComponent } from './farmProposal/farmApproval/farmApproval.component';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountModule } from './account/account.module';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UsersComponent,
    FarmProposalComponent,
    CreateFarmProposalComponent,
    FarmProposalDetailComponent,
    EditUserComponent,
    FarmApprovalComponent,
    AboutUsComponent,
    ContactUsComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent
   ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    HomeModule,
    NgxSpinnerModule,
    FileUploadModule,
    SharedModule,
    MatCheckboxModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
  ],
  providers: [
    HasRoleDirective,
    AlertifyService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
