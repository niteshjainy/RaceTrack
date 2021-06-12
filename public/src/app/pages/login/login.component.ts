import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from '../../service/api.service'
import { FormService } from '../../service/form/form.service'
import { CookieService } from "ngx-cookie-service";
import { Md5 } from 'ts-md5/dist/md5';
import { log } from 'util';
import * as $ from "jquery";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder, private cookieService: CookieService, private MD5: Md5, private router: Router, private route: ActivatedRoute, public formService: FormService, private api: ApiService) { }
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
        let data = await this.api.post("/auth/login", this.form.value)
        this.loginData = data.data;
        if (data.status == true) {
          // this.cookieService.set("login", this.loginData); // Old one not working
          this.cookieService.set('login', JSON.stringify(this.loginData), 1 , '/', 'localhost', false, "Lax" );
          this.router.navigate(['/dashboard'])
        }
        else {
          alert(data.message)
          setTimeout(function () {
            $('.error-msg').fadeIn('slow');
          });
        }
      }
      catch (error){
        alert(error.message)
        console.log("catch", error)
      }
    } 
    setTimeout(function () {
      $('.error-msg').fadeOut('slow');
    }, 3000);
  }

}


