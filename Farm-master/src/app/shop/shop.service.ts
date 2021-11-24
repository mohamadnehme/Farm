import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination, Pagination } from '../shared/models/pagination';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
import { of } from 'rxjs';
import { Photo } from '../shared/models/photo';
@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:44352/api/';
  products: IProduct[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();
  navbarOpen = false;
  ishome = false;

  constructor(private http: HttpClient) { }

  getProducts(useCache: boolean) {
    // if (useCache === false) {
    //   this.products = [];
    // }
    this.products = [];
    // if(this.products.length > 0 && useCache === true){
    //   const pagesReceived = Math.ceil(this.products.length / this.shopParams.pageSize);

    //   if(this.shopParams.pageNumber <= pagesReceived){
    //     this.pagination.data = this.products.slice((this.shopParams.pageNumber - 1) * this.shopParams.pageSize,this.shopParams.pageNumber * this.shopParams.pageSize);
    //     return of(this.pagination);
    //   }
    // }

    let params = new HttpParams();

    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search)
    }

    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + 'products', { observe: 'response', params })
      .pipe(
        map(response => {
          this.products = [...this.products, ...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      )
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    const product = this.products.find(p => p.id === id);

    if (product) {
      return of(product);
    }

    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  deleteProduct(productId){
    return this.http.delete<IProduct>(this.baseUrl + "products/deleteProduct/"+productId);
  }

  createProduct(product: IProduct, photo: Photo){

    if(photo){
      product.pictureUrl = photo.url;
    } else {
      product.pictureUrl = '';
    }
    return this.http.post(this.baseUrl + "products/", product)
      .pipe(
        map((response: any) => {
          // this.products = response.data;
          this.getProducts(false);
        })
      )
  }
  createFarmProposal(farm: any, photo: any[]){
    farm.photos = [];
    farm.photos.push(photo);
    return this.http.post(this.baseUrl + "products/createProposal", {
      ownerName: farm.ownerName,
      ownershipType: farm.ownershipType,
      ownerEmail: farm.ownerEmail,
      phone: farm.phone,
      farmName: farm.farmName,
      area: farm.area,
      location: farm.location,
      soilType: farm.soilType,
      description: farm.description,
      photos: photo,
      agricultureHoldingNumber: farm.agricultureHoldingNumber
    })
      .pipe(
        map((response: any) => {
          console.log(response);

        })
      )
  }
  getFarmProposals(){
    return this.http.get(this.baseUrl + 'products/GetProposals');
  }

  getFarmProposalsA(){
    return this.http.get(this.baseUrl + 'products/GetProposalsA');
  }

  getFarmProposal(id){
    return this.http.get(this.baseUrl + 'products/GetProposals/'+ id);
  }

  sendMail(emailTo, id){
    return this.http.post(this.baseUrl + 'products/sendEmail/'+id, {
      EmailTo: emailTo,
      Subject: '',
      Body: ''
    });
  }

  sendMailPayment(payment){
    return this.http.post(this.baseUrl + 'products/sendEmailPayment', payment);
  }

  deletePhoto(id: string){
    return this.http.delete(this.baseUrl + 'products/' + id);
  }

  reject(farmId){
    return this.http.delete(this.baseUrl + 'products/deleteFarmP/'+farmId);
  }

}
