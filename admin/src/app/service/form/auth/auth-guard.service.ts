

import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';


@Injectable()

export class AuthGuardService {
    cookieValue: any;

    constructor(private cookieService: CookieService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean  {
        console.log(this.cookieService);
        // return true;
        if (this.cookieService.check('login')) 
        {    
            return true;  
        }   
        return false;  
        }  
    }
   
    

    


