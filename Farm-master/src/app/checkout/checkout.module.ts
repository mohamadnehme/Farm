import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckOutRoutingModule } from './checkout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';

@NgModule({
  imports: [
    CommonModule,
    CheckOutRoutingModule,
    SharedModule
  ],
  declarations: [
    CheckoutComponent,
    CheckoutSuccessComponent,
    CheckoutPaymentComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CheckoutModule { }
