import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormService } from '../../service/form/form.service'
import $ from "jquery";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent implements OnInit {

  constructor(private api: ApiService,
    public formService: FormService,
    private formBuilder: FormBuilder,
    private _ngxSpinnerSvc: NgxSpinnerService) {
  }
  public form: FormGroup;
  public submitted = false;
  showClick = false;
  TypeDataStatus; TypeDataError;
  // racetrackTypes;
  typesdata; typeData; responseData; message;
  raceTrackConfig;
  currentPage = 1;
  maxSize = 5;

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
      let data = await this.api.get(`/admin/types?pagination=${this.currentPage}`);
      if (data.status == true) {
        // this.racetrackTypes = data.data.data;
        this.raceTrackConfig = data.data;
      }
      this._ngxSpinnerSvc.hide();
    }
    catch (error) {
      alert(error);
      this._ngxSpinnerSvc.hide();
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
        this.TypeDataStatus = data.status;
        this.TypeDataError = data.message;
        if (this.TypeDataStatus == true) {
          $(".close").click();
          this.form.reset();
          alert(this.TypeDataError)
          this.RacetrackType()
        }
        else {
          alert(this.TypeDataError);
          this._ngxSpinnerSvc.hide();
        }
      }
      catch (error) {
        alert(error);
        this._ngxSpinnerSvc.hide();
      }
    }
  }

  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      let datas = await this.api.post("/admin/change_status", { 'status': status, 'id': id, 'type': 'Type' })
      this.RacetrackType()
    }
    catch (error) {
      alert(error);
      this._ngxSpinnerSvc.hide();
    }
  }

  async updateForm() {
    this._ngxSpinnerSvc.show();
    try {
      let data = await this.api.post('/admin/update_type', this.typesdata);
      this.message = data.message;
      this.responseData = data.response;
      if (data.status === true) {
        alert(this.message)
        $('.close').click()
        this.RacetrackType()
      } else {
        alert(this.message);
        this._ngxSpinnerSvc.hide();
      }
    } catch (error) {
      alert(error);
      this._ngxSpinnerSvc.hide();
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
}
