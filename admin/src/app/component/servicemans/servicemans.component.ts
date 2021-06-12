import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import $ from "jquery";
import { FormService } from 'src/app/service/form/form.service';

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
      servicemans: []
    }
  }
  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.Servicemans();
    
    this._createForm();

    this.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
     // Serviceman Settings
     this.servicemandropdownSettings = {
      singleSelection: false,
      //idField: 'id',
      //textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
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
    // if(this.availableDay && this.availableDay.length) {
    //   this.availableDay.forEach(item => {
    //     formData.append('servicemans[]', item);
    //   })
    // }
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

    this.servicemanForm.patchValue({
      name: values.name || '',
      contact_no: values.contact_no || '',
      email_id: values.email_id || '',
      address: values.address || '',
      // specializations: values.specializations || '',
      available_hours: values.available_hours || '',
      rating: values.rating || 0,
      ser_long: values.rating || 0,
      ser_lat: values.rating || 0
    });
    this.config.editData.servicemans = JSON.parse(values.specializations);
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
