import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {

  @Input() appHasRole: string[];
  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) { }

  ngOnInit(){

    this.accountService.currentUserSource.subscribe((any: any) => {

      if(this.accountService.decodeToken != undefined){
        const userRoles = this.accountService.decodeToken.role as Array<string>;

        // if no roles clear th view Container Ref
        if(!userRoles){
          this.viewContainerRef.clear();
        }

        // if user has role need then render the element
        if(this.accountService.roleMatch(this.appHasRole)){
          if(!this.isVisible){
            this.isVisible = true;
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          }
          else{
            this.isVisible = false;
            this.viewContainerRef.clear();
          }
        }
      }
    })
  }
}
