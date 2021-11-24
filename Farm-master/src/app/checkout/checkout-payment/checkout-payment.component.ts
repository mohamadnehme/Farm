import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from 'src/app/shop/shop.service';
import { CheckoutService } from '../checkout.service';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  @Input() payment: any;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  stripe: any;
  cardNumber: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  loading = false;
  cardNumberValid = false;
  id;
  quantity;
  elements: any;
  constructor(private checkoutService: CheckoutService,
    private shopService: ShopService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService, private router: Router) {}

  ngAfterViewInit(): void {
    this.id = this.activateRoute.snapshot.paramMap.get('id');

    const appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '5.5px',
        borderRadius: '4px',
        fontSmooth: 'auto',
      }
    };
    const clientSecret = this.payment.clientSecret;
    this.stripe = Stripe('pk_test_51JizJNGakhkkMG1OgYxEjgALebdySsPq1bXIql5Hvyvff82byjjiMBAHl442kG8Z8bmQdxaBo7zj7nRK5vusCTSs00f3CQHhY4');
    this.elements = this.stripe.elements({ appearance, clientSecret });


    this.cardNumber = this.elements.create('payment');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
  }

  onChange(event) {
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }
    switch(event.elementType) {
      case 'payment':
        this.cardNumberValid = event.complete;
        break;
    }
  }

  async submitOrder(elements) {
    this.loading = true;
    try {
      const paymentResult = await this.confirmPaymentWithStripe(elements);
      if (paymentResult.paymentIntent) {

        this.createOrder(this.id, this.payment);

        this.toastr.success("Investment succeeded");

        this.shopService.sendMailPayment(JSON.parse(localStorage.getItem('payment'))).subscribe(() => {

          this.toastr.success("email has sended");

          localStorage.removeItem('payment');

          this.router.navigateByUrl('/shop');
        });


      } else {
        this.toastr.error(paymentResult.error.message);
      }
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.loading = false;
    }
  }

  private async confirmPaymentWithStripe(elements) {

    return this.stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });
  }

  private async createOrder(product, payment) {
    return this.checkoutService.createOrder(product, payment).toPromise();
  }
}
