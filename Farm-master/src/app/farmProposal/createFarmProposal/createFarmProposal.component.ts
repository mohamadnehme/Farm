import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { Photo } from 'src/app/shared/models/photo';
import { IUser } from 'src/app/shared/models/user';
import { ShopService } from 'src/app/shop/shop.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-createFarmProposal',
  templateUrl: './createFarmProposal.component.html',
  styleUrls: ['./createFarmProposal.component.scss']
})
export class CreateFarmProposalComponent implements OnInit {

  constructor(private fb: FormBuilder, public shopService: ShopService, private router: Router,private accountService: AccountService){ }
  currentUser$: Observable<IUser>;
  baseUrl = environment.apiUrl;
  uploader:FileUploader;
  hasBaseDropZoneOver = false;
  photos: Photo[] = [];

  productForm: FormGroup;
  errors: string[];
  ownerShip = ['PartnerShip', 'Corporation', 'SaleProprietor'];
  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$
    this.initializeUploader();
    this.createProductForm();
  }

  logout(){
    this.accountService.logout();
  }

  createProductForm() {
    this.productForm = this.fb.group({
      ownerName: [null, [Validators.required]],
      ownershipType: ['1', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]{8}")]],
      ownerEmail: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      farmName: [null, [Validators.required]],
      agricultureHoldingNumber: [null, [Validators.required, Validators.min(0)]],
      area: [null, [Validators.required]],
      location: [null, [Validators.required]],
      soilType: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.shopService.createFarmProposal(this.productForm.value, this.photos).subscribe(response => {
      this.router.navigateByUrl('/shop');

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
        this.photos.push({
          id: res.id,
          url: res.url
        })
        console.log(this.photos);

      }
    }
  }

  deletePhoto(id: string){
    let i = confirm('Are you sure you want to delete this photo?');

    if(i == true){
      this.shopService.deletePhoto(id).subscribe(() => {
        let index = this.photos.findIndex(p => p.id === id);
        this.photos.splice(index, 1);
        console.log(index);

      }, error => {
        console.log(error);

      })
    }
  }
}
