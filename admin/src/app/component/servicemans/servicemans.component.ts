import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import $ from "jquery";
import { FormService } from 'src/app/service/form/form.service';
import * as moment from 'moment';

@Component({
  selector: 'app-servicemans',
  templateUrl: './servicemans.component.html',
  styleUrls: ['./servicemans.component.css']
})
export class ServicemansComponent implements OnInit {

  constructor(
    private api: ApiService, 
    private _ngxSpinnerSvc: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private _toastrSvc: ToastrService,
    public formService: FormService) { }
  // servicemanList
  servicemanConfig;
  currentPage = 1;
  maxSize = 5;
  deleteId;
  days:any
  public servicemandropdownSettings: any = {};
  
  servicemanForm: FormGroup;
  public serverServicemans = [];
  public deleteServicemans = [];
  availableDay =[];

  config = {
    action: 'add',
    editData: {
      id: null,
      servicemans: [],
      available_day:[]
    }
  }
  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.Servicemans();
    
    this._createForm();

  //  this.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
    this.days = [
      {
         "id":1,
         "name":1
      },
      {
         "id":2,
         "name":2
      },
      {
         "id":3,
         "name":3
      },
      {
         "id":4,
         "name":4
      },
      {
         "id":5,
         "name":5
      },
      {
         "id":6,
         "name":6
      },
      {
         "id":7,
         "name":7
      },
      {
         "id":8,
         "name":8
      },
      {
         "id":9,
         "name":9
      },
      {
         "id":10,
         "name":10
      },
      {
         "id":11,
         "name":11
      },
      {
         "id":12,
         "name":12
      },
      {
         "id":13,
         "name":13
      },
      {
         "id":14,
         "name":14
      },
      {
         "id":15,
         "name":15
      },
      {
         "id":16,
         "name":16
      },
      {
         "id":17,
         "name":17
      },
      {
         "id":18,
         "name":18
      },
      {
         "id":19,
         "name":19
      },
      {
         "id":20,
         "name":20
      },
      {
         "id":21,
         "name":21
      },
      {
         "id":22,
         "name":22
      },
      {
         "id":23,
         "name":23
      },
      {
         "id":24,
         "name":24
      },
      {
         "id":25,
         "name":25
      },
      {
         "id":26,
         "name":26
      },
      {
         "id":27,
         "name":27
      },
      {
         "id":28,
         "name":28
      },
      {
         "id":29,
         "name":29
      },
      {
         "id":30,
         "name":30
      },
      {
         "id":31,
         "name":31
      }
      
     
    
   ]
     // Serviceman Settings
     this.servicemandropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
     // allowSearchFilter: true
    };
  }

  private _createForm() {
    this.servicemanForm = this.formBuilder.group({
      name: ['', Validators.required],
      contact_no: ['', Validators.required],
      email_id: ['', Validators.required],
      address: ['', Validators.required],
      specializations: [[]],
      available_hours: ['', Validators.required],
      rating: [''],
      ser_lat: ['', Validators.required],
      ser_long: ['', Validators.required],
      available_day: [[], Validators.required],
      allocation_end_date: ['', Validators.required],
      allocation_start_date: ['', Validators.required],
    })
  }
  onServicemanItemSelect(item: any) {
    const i = this.deleteServicemans.findIndex(y => y === item);
    if (i != -1) {
      this.deleteServicemans.splice(i, 1);
    }
    this.availableDay.push(item);
  }

  onServicemanDeSelect(item: any) {
    this.availableDay.splice(this.availableDay.findIndex(y => y === item), 1);
    const l = this.serverServicemans.find(y => y=== item);
    if (l) {
      this.deleteServicemans.push(l);
    }
  }

  async Servicemans() {
    // try {
      let data = await this.api.get(`/admin/servicemans?pagination=1&page=${this.currentPage}`);
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

  async addServiceman() {
    if (this.servicemanForm.invalid) {
      this._toastrSvc.error('Error', 'Please Fill All Required Input Fields.');
      return;
    }

    this._ngxSpinnerSvc.show();
    this.servicemanForm.patchValue({
      allocation_start_date: moment(this.servicemanForm.value.allocation_start_date).format("YYYY-MM-DD"),
      allocation_end_date: moment(this.servicemanForm.value.allocation_end_date).format("YYYY-MM-DD"),
     
    })
    let formVal = this.servicemanForm.value;
    try {
      let datas;
      let url = '';
      if(this.config.action !== 'edit') {
        url = '/admin/add_serviceman';
      } else {
        url = '/admin/update_serviceman';
        formVal.id = this.config.editData.id;
      }
      datas = await this.api.post(url, formVal);

      this.servicemanForm.reset();
      $('.close').click();
      this.Servicemans();
      this._toastrSvc.success('Success', datas.message);
    } catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error.message);
    }
  }

  setForm(values) {
    this.config.action = 'edit';
    this.config.editData.servicemans = [];
    this.config.editData.available_day = [];

    this.servicemanForm.patchValue({
      name: values.name || '',
      contact_no: values.contact_no || '',
      email_id: values.email_id || '',
      address: values.address || '',
      // specializations: values.specializations || '',
      available_hours: values.available_hours || '',
      rating: values.rating || 0,
      ser_long: values.rating || 0,
      ser_lat: values.rating || 0,
      allocation_start_date: new Date(values.allocation_start_date),
      allocation_end_date: new Date(values.allocation_end_date),
    });
    this.config.editData.servicemans = JSON.parse(values.specializations);
    this.config.editData.available_day = JSON.parse(values.available_day);
    this.config.editData.id = values.id;
  }

  onSelect(e) {
    console.log(e, 'event')
  }

  addAction() {
    this.servicemanForm.reset();
    this.config.action = 'add';
  }

  async deleteSubmit() {
    this._ngxSpinnerSvc.show();
    try {
      let url = `/serviceman/delete_serviceman?id=${this.deleteId}`;
      let data = await this.api.get(url)

      if (data && data.status) {
        $('.close').click();
        this._toastrSvc.success('Success', data.message);
        this.Servicemans()
      } else {
        this._toastrSvc.error('Error', data.message);
        this.Servicemans()
      }
    } catch (error) {
      this._toastrSvc.error('Error', error);
      this.Servicemans()
    }
  }

  deleteAction(id) {
    this.deleteId = id;
  }


}
