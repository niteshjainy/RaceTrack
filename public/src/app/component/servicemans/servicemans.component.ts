import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-servicemans',
  templateUrl: './servicemans.component.html',
  styleUrls: ['./servicemans.component.css']
})
export class ServicemansComponent implements OnInit {

  constructor(private api: ApiService, private _ngxSpinnerSvc: NgxSpinnerService) { }
  // servicemanList
  servicemanConfig;
  currentPage = 1;
  maxSize = 5;
  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.Servicemans()
  }
  async Servicemans() {
    // try {
      let data = await this.api.get(`/admin/servicemans?pagination=${this.currentPage}`);
      if (data.status == true) {
        // this.servicemanList = data.data.data;
        this.servicemanConfig = data.data;
      } else {
      }
      this._ngxSpinnerSvc.hide();
    // }
    // catch (error) {}
  }
  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      let datas = await this.api.post("/admin/change_status", {'status':status, 'id':id,'type':'Serviceman'})
      this.Servicemans()
    }
    catch (error) {
      this._ngxSpinnerSvc.show();
    }
  }

  pageChanged(e) {
    this._ngxSpinnerSvc.show();
    this.currentPage = e.page;
    this.Servicemans();
  }
}
