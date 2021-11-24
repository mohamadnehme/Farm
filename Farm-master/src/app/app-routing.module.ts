import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { CreateFarmProposalComponent } from './farmProposal/createFarmProposal/createFarmProposal.component';
import { FarmProposalComponent } from './farmProposal/farmProposal.component';
import { FarmProposalDetailComponent } from './farmProposal/farmProposalDetail/farmProposalDetail.component';
import { HomeComponent } from './home/home.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { FarmApprovalComponent } from './farmProposal/farmApproval/farmApproval.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';

const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
  {path: 'server-error', component: ServerErrorComponent, data: {breadcrumb: 'Server Errors'}},
  {path: 'not-found', component: NotFoundComponent, data: {breadcrumb: 'Not Found'} },
  {path: 'test-error', component: TestErrorComponent, data: {breadcrumb: 'Test Errors'} },
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopedModule), data: {breadcrumb: 'Shop'}},
  {path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule), data: {breadcrumb: 'Basket'}},
  {path: 'checkout/:id', canActivate: [AuthGuard], loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule), data: {breadcrumb: 'Payment'}},
  {path: 'admin', component: AdminComponent, data: {breadcrumb: 'Create Farm'} },
  {path: 'users', component: UsersComponent, data: {breadcrumb: 'Users'} },
  {path: 'farm', component: FarmProposalComponent, data: {breadcrumb: 'Farms Proposal'}},
  {path: 'farmApproval', component: FarmApprovalComponent, data: {breadcrumb: 'Farms Proposal Approval'}},
  {path: 'createFarm', component: CreateFarmProposalComponent, data: {breadcrumb: 'Create Farm Proposal'}},
  {path: 'farmDetail/:id', component: FarmProposalDetailComponent, data: {breadcrumb: 'Farm Proposal Detail'}},
  {path: 'editUser', component: EditUserComponent, data: {breadcrumb: 'Edit User'}},
  {path: 'about', component: AboutUsComponent, data: {breadcrumb: 'about us'}},
  {path: 'contact', component: ContactUsComponent, data: {breadcrumb: 'contact us'}},
  {path: 'dashboard', component: DashboardComponent, data: {breadcrumb: 'dashboard'}},
  {path: 'login', component: LoginComponent, data: {breadcrumb: 'login'}},
  {path: 'orders',
  canActivate: [AuthGuard],
  loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule),
  data: { breadcrumb: 'Orders' }
},
  {path: 'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule), data: {breadcrumb: {skip: true}}},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
