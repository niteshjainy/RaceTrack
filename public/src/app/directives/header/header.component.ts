import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { ApiService } from '../../service/api.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cookieValue;
  public submitted = false;
  public profileDetails: any
  public userData: any
  successData: any
  msgData: any
  constructor(private cookieService: CookieService, private router: Router, private api: ApiService) { }
  p: number = 1;
  public offset = 0;
  public limit = 5;
  public pagination: any = [1];
  public filter: any
  showClick = false;
  public count: number;
  public current_page = 1;
  dotPage = false;
  public list: any;
  public term: any;
  public listCount: any;
  public listCount2: any;
  page: any;
  setOffset(page) {
    this.current_page = page;
    this.offset = (page * this.limit) - this.limit;
    // this.GetnotificationList()

  }

  setPage(page: number, currentpage: number, limit: number) {
    console.log(currentpage);
    if (limit !== 0) {
      currentpage = currentpage / limit;
    }
    this.count = page;
    this.pagination = [1];
    for (let i = 1; i <= this.count; i++) {
      if (i % this.limit === 0) {
        this.pagination.push((i / this.limit) + 1);
      }
    }
    if (this.pagination.length > 5) {
      const lastpage = this.pagination[this.pagination.length - 1];
      if (currentpage < 4) {
        this.dotPage = false;
        this.pagination = this.pagination.splice(0, 5);
      } else if (currentpage > (lastpage - 4)) {
        this.pagination = this.pagination.splice(lastpage - 5, 5);
        this.dotPage = false;
      } else {
        this.dotPage = true;
        this.pagination = [1, '. .', currentpage, currentpage + 1, currentpage + 2, '. .', lastpage];
        console.log(currentpage);
      }
    }
  }
  ngOnInit() {
    // this.userData = JSON.parse(this.cookieService.get("login"))
    //console.log(this.userData.user.user_id);
    // this.GetnotificationList()
    
  }
  public logout() {
    try {
      this.cookieService.delete('login')

      this.router.navigateByUrl('/login');

    } catch (error) {
    }
  }


  notificationList
  notificationCount
  msgData2
  successData2
  dashCount
  notificationcount

  
}
