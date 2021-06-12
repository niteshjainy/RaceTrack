import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../service/form/form.service'
import $ from "jquery";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent implements OnInit {

  constructor(private api: ApiService,
    public formService: FormService,
    private formBuilder: FormBuilder,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _toasterSvc: ToastrService) {
  }
  public form: FormGroup;
  public submitted = false;
  showClick = false;
  TypeDataStatus; TypeDataError;
  typesdata; typeData; responseData; message;
  raceTrackConfig;
  currentPage = 1;
  maxSize = 5;
  deleteId;

  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      desc: ['', [Validators.required]],
    })
    this.RacetrackType()
  }

  async RacetrackType() {
    try {
      let data = await this.api.get(`/admin/types?pagination=1&page=${this.currentPage}`);
      if (data.status == true) {
        this.raceTrackConfig = data.data;
      } else {
        this._toasterSvc.error('Error', data.message);
      }
      this._ngxSpinnerSvc.hide();
    }
    catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toasterSvc.error('Error', error);
    }
  }

  async addTypeForm() {
    this.submitted = true;
    if (this.form.value.name == '' && this.form.value.desc) {
    }
    else {
      this._ngxSpinnerSvc.show();
      try {
        let data = await this.api.post("/admin/add_type", this.form.value)
        
        if (data.status) {
          $(".close").click();
          this._toasterSvc.success('Success', data.message);
          this.form.reset();
          this.RacetrackType()
        }
        else {
          this._ngxSpinnerSvc.hide();
          this._toasterSvc.error('Error', data.message);
        }
      }
      catch (error) {
        this._ngxSpinnerSvc.hide();
        this._toasterSvc.error('Error', error);
      }
    }
  }

  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      let datas = await this.api.post("/admin/change_status", { 'status': status, 'id': id, 'type': 'Type' })
      this._toasterSvc.success('Success', datas.message);
      this.RacetrackType()
    }
    catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toasterSvc.error('Error', error);
    }
  }

  async updateForm() {
    this._ngxSpinnerSvc.show();
    try {
      let data = await this.api.post('/admin/update_type', this.typesdata);
      this.responseData = data.response;
      if (data.status === true) {
        this._toasterSvc.success('Success', data.message);
        $('.close').click()
        this.RacetrackType()
      } else {
        this._ngxSpinnerSvc.hide();
        this._toasterSvc.error('Error', data.message);
      }
    } catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toasterSvc.error('Error', error);
    }
  }

  EditForm(AllData) {
    console.log(AllData);
    this.showClick = true;
    this.typesdata = AllData;
  }

  pageChanged(e) {
    this._ngxSpinnerSvc.show();
    this.currentPage = e.page;
    this.RacetrackType();
  }

  async deleteSubmit() {
    this._ngxSpinnerSvc.show();
    try {
      let url = `/admin/delete_type?id=${this.deleteId}`;
      let data = await this.api.get(url)

      if (data && data.status) {
        this.form.reset();
        $('.close').click();
        this._toasterSvc.success('Success', data.message);
        this.RacetrackType()
      } else {
        this._toasterSvc.error('Error', data.message);
        this.RacetrackType()
      }
    } catch (error) {
      this._toasterSvc.error('Error', error);
      this.RacetrackType()
    }
  }

  deleteAction(id) {
    this.deleteId = id;
  }
}
