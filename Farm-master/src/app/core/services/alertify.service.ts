import { Injectable } from '@angular/core';
import alertify from '../../../../node_modules/alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  confirm(message: string , okCallback: () => any){
    alertify.confirm(message, function(){ okCallback();}
                , function(){ });
  }
  success(message:string){
    alertify.success(message);
  }
  error(message:string){
    alertify.error(message);
  }
  warning(message:string){
    alertify.warning(message);
  }
  message(message:string){
    alertify.message(message);
  }
}
