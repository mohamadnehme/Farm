import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';
import { ShopService } from '../shop/shop.service';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<IBasket>(null!);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null!);
  basketTotal$ = this.basketTotalSource.asObservable();
  payment;

  shipping = 0;

  constructor(private http: HttpClient, private toast: ToastrService, private shopService: ShopService) { }

  createPaymentIntent(product, quantity) {
    return this.http.post(this.baseUrl + 'payments/'+quantity, product)
      .pipe(
        map((payment: any) => {
          this.payment = payment;
          localStorage.setItem('payment', JSON.stringify(payment));
        })
      )
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateTotal();
    this.setBasket(basket);
  }

  getBasket(id: string){
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' +id)
    .pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.shipping = basket.shippingPrice;
        this.calculateTotal();
      })
    );
  }

  setBasket(basket: IBasket){
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotal();

    }, error => {
      console.log(error);
    })
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1){
    if(item.unitQuantity < quantity){
      this.toast.error('there is no enough unit');
      return;
    }
    const itemToAdd: IBasketItem = this.mapProductItemToBasket(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdate(basket.items, itemToAdd, quantity, item);
    this.setBasket(basket);
    return;
  }

  incrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    this.shopService.getProduct(item.id).subscribe((p: IProduct) => {
      if(p.unitQuantity >= basket.items[foundItemIndex].quantity + 1){
        basket.items[foundItemIndex].quantity++;
        this.setBasket(basket);
      }
    })
  }

  decrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if(basket.items[foundItemIndex].quantity > 1){
      basket.items[foundItemIndex].quantity--;
    } else {
      this.removeItemFromBasket(item);
    }
    this.setBasket(basket);
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if(basket.items.some(x => x.id === item.id)){
      basket.items = basket.items.filter(i => i.id !== item.id);
      if(basket.items.length > 0){
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id='+basket.id).subscribe(() => {
      this.basketSource.next(null!);
      this.basketTotalSource.next(null!);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }

  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  private calculateTotal(){
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a ,b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal});
  }

  private addOrUpdate(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number, item: IProduct): IBasketItem[] {

    const index = items.findIndex(i => i.id === itemToAdd.id);
    if(index === -1){
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      if(item.unitQuantity < items[index].quantity + quantity){
        this.toast.error('there is no enough unit');
        return items;
      }
      items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasket(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item[0].url,
      quantity
    }
  }
}
