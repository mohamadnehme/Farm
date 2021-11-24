import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';
import { Photo } from '../shared/models/photo';
import { IUser } from '../shared/models/user';
import { ShopService } from '../shop/shop.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private fb: FormBuilder, public shopService: ShopService, private router: Router, private accountService: AccountService){ }
  baseUrl = environment.apiUrl;
  uploader:FileUploader;
  hasBaseDropZoneOver = false;
  photo: Photo;
  navbarOpen = false;
  productForm: FormGroup;
  errors: string[];
  currentUser$: Observable<IUser>;

  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$
    this.initializeUploader();
    this.createProductForm();
  }

  createProductForm() {
    this.productForm = this.fb.group({
      name: [null, [Validators.required]],
      roi: ['', [Validators.required, Validators.min(1)]],
      farmCycle: ['', [Validators.required, Validators.min(1)]],
      location: [null, [Validators.required]],
      interest: ['', [Validators.required, Validators.min(1)]],
      description: [null, [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      unitQuantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  logout(){
    this.accountService.logout();
  }

  onSubmit() {
    this.shopService.createProduct(this.productForm.value, this.photo).subscribe(response => {
      this.router.navigateByUrl('/shop');
      console.log(response);

    }, error => {
      console.log(error);
      this.errors = error.errors;
    })
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'products/addPhoto',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10*1024*1024
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
        const res: Photo = JSON.parse(response);
        this.photo = {
          id: res.id,
          url: res.url
        }
        console.log(this.photo);
      }
    }
  }

  deletePhoto(id: string){
    let i = confirm('Are you sure you want to delete this photo?');

    if(i == true){
      this.shopService.deletePhoto(id).subscribe(() => {
        this.photo = null;
      }, error => {
        console.log(error);

      })
    }
  }
}
