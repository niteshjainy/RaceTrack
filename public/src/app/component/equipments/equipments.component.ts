import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.css']
})
export class EquipmentsComponent implements OnInit {

  constructor(private api: ApiService, private _ngxSpinnerSvc: NgxSpinnerService) { }
  // equipmentsList: any;
  equipmentConfig;
  currentPage = 1;
  maxSize = 5;
  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.Equipments()
  }
  async Equipments() {
    // try {
      let data = await this.api.get(`/admin/equipments?pagination=${this.currentPage}`);
      console.log('Data===', data);
      if (data.status === true) {
        // this.equipmentsList = data.data.data;
        this.equipmentConfig = data.data;
      } else {
      }
      this._ngxSpinnerSvc.hide()
    // };
    // catch (error) {}
  }
  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      let datas = await this.api.post('/admin/change_status', {'status': status, 'id': id,'type': 'Equipment'})
      this.Equipments();
    } catch (error) {
      this._ngxSpinnerSvc.hide();
    }

  }

  pageChanged(e) {
    this._ngxSpinnerSvc.show();
    this.currentPage = e.page;
    this.Equipments();
  }

}
