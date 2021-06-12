import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  UserData:any;
  constructor(private cookieService: CookieService, private router: Router) { }
  public logout() {
    try {
      this.cookieService.delete('login')
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.log(error);
    }
  }
  ngOnInit() {
    this.UserData = JSON.parse(this.cookieService.get('login')).userdata;
  }

}
