import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import $ from "jquery";
import { FormService } from 'src/app/service/form/form.service';

@Component({
  selector: 'app-servicemans',
  templateUrl: './serviceman.component.html',
  styleUrls: ['./serviceman.component.css']
})
export class ServicemanComponent implements OnInit {

  constructor(
    private api: ApiService, 
    private _ngxSpinnerSvc: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private _toastrSvc: ToastrService,
    public formService: FormService) { }
  servicemanList;
  servicemanConfig;
  currentPage = 1;
  maxSize = 5;
  
  servicemanForm: FormGroup;

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
  }

  private _createForm() {
    this.servicemanForm = this.formBuilder.group({
      name: ['', Validators.required],
      contact_no: ['', Validators.required],
      email_id: ['', Validators.required],
      address: ['', Validators.required],
      specializations: [[]],
      available_hours: ['', Validators.required],
      rating: ['']
    })
  }


  async Servicemans() {
    // try {
      let data = await this.api.get(`/admin/servicemans?pagination=1&page=${this.currentPage}`);
      if (data.status == true) {
         this.servicemanList = data.data.data;
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
      this._toastrSvc.success('Success', datas.message)
    }
    catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error);
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

    if(typeof this.servicemanForm.value.specializations !== 'object') {
      this._toastrSvc.error('Error', 'Specializations have invalid value.');
      return;
    }

    this._ngxSpinnerSvc.show();
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
    console.log(values, 'values');

    this.servicemanForm.patchValue({
      name: values.name || '',
      contact_no: values.contact_no || '',
      email_id: values.email_id || '',
      address: values.address || '',
      // specializations: values.specializations || '',
      available_hours: values.available_hours || '',
      rating: values.rating || 0
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
}
