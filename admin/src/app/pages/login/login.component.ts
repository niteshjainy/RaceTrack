import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from '../../service/api.service'
import { FormService } from '../../service/form/form.service'
import { CookieService } from "ngx-cookie-service";
import { Md5 } from 'ts-md5/dist/md5';
import { log } from 'util';
import * as $ from "jquery";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment.prod";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private cookieService: CookieService, 
    private MD5: Md5, 
    private router: Router, 
    private route: ActivatedRoute, 
    public formService: FormService, 
    private api: ApiService,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _toastrSvc: ToastrService) { }
  public submitted = false;
  cookieValue: any;
  allCookies: any; 
  loginData: any;
  message: any;
  showElement = true;
  ngOnInit() {
    this.form = this.formBuilder.group({
      email_id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,4}')]],
      password: ['', [Validators.required]],
    })
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.value.email_id !== '' && this.form.value.password !== '') {
      try {
        this._ngxSpinnerSvc.show();
        let data = await this.api.post("/auth/login", this.form.value)
        this.loginData = data.data;
      
        if (data.status == true) {
          console.log(data)
          // this.cookieService.set("login", this.loginData); // Old one not working
          console.log(this.loginData,"this.loginData")
         
          // this.cookieService.set('login', JSON.stringify(this.loginData), 1 , '/', 'ec2-54-72-157-102.eu-west-1.compute.amazonaws.com', false, "Lax" );
      //  this.cookieService.set('login', JSON.stringify(this.loginData), 1, '/', 'localhost', false, "Lax");
          
         // For Production comment all cokkies expect this
          this.cookieService.set('login', JSON.stringify(this.loginData), 1, '/', '54.169.73.89', false, "Lax");
          
          
          // For Development
          this.router.navigate(['/dashboard'])
        }
        else {
          // alert(data.message);
          this._toastrSvc.error('Error', data.message);
          this._ngxSpinnerSvc.hide();
          setTimeout(function () {
            $('.error-msg').fadeIn('slow');
          });
        }
      }
      catch (error){
        // alert(error.message)
        this._toastrSvc.error('Error', error.message);
        console.log("catch", error);
        this._ngxSpinnerSvc.hide();
      }
    } 
    setTimeout(function () {
      $('.error-msg').fadeOut('slow');
    }, 3000);
  }

}


