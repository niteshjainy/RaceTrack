import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/service/api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';

@Component({
  selector: 'app-landing-page-details',
  templateUrl: './landing-page-details.component.html',
  styleUrls: ['./landing-page-details.component.css']
})
export class LandingPageDetailsComponent implements OnInit {

  raceTrackDetails: {[key: string]: any} = {rating: 0};

  isShowCalender: boolean = false;
  datePickerConfig = { 
    containerClass: 'theme-red', 
    datesDisabled: [new Date('2020-02-05')],
    dateTooltipTexts: []
  };

  modalRef: BsModalRef;
  contactUsForm: FormGroup;

  constructor(
    private _apiSvc: ApiService,
    private _actRoute: ActivatedRoute,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _location: Location,
    private _modalSvc: BsModalService,
    private _fb: FormBuilder,
    private _toastrSvc: ToastrService
  ) { }

  ngOnInit() {
    let contentId;
    this._actRoute.params.subscribe(perm => {
      if(perm && perm.id) {
        this._getRaceTrack(perm.id);
        contentId = perm.id;
      }
    });
    if(contentId) {
      this._createForm(contentId);
    }
  }

  private async _getRaceTrack(id) {
    this._ngxSpinnerSvc.show();
    let responce = await this._apiSvc.get(`/details/${id}`);
    if(responce && responce.code === 200 && responce.status === true) {
      this.raceTrackDetails = responce.data;

      if(this.raceTrackDetails.racetrack_servicemans && this.raceTrackDetails.racetrack_servicemans.length) {
        this._parseJsonOfMachenics()
      }
      this._getBookedDates(this.raceTrackDetails.allocation_start_date, this.raceTrackDetails.allocation_end_date);
    } else {
      this.raceTrackDetails = null;
    }
    this._createImgPath();
    this._ngxSpinnerSvc.hide();
  }

  private _createImgPath() {
      if (this.raceTrackDetails.images) {
        let imgArr: Array<string> = JSON.parse(this.raceTrackDetails.images);
        this.raceTrackDetails.imageUrls = [];
        if (imgArr.length) {
          imgArr.forEach(item => {
            this.raceTrackDetails.imageUrls.push(`${this._apiSvc.imgBasePath}/${this.raceTrackDetails.image_uid}/${item}`);
          });
        } else {
          this.raceTrackDetails.imageUrls = null;
        }
      }
  }

  private _parseJsonOfMachenics() {
    this.raceTrackDetails.racetrack_servicemans.map(item => {
      item.servicemans.specializations = JSON.parse(item.servicemans.specializations);
    });
  }

  goBack() {
    this._location.back();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this._modalSvc.show(template);
  }

  
  private _createForm(contentId) {
    this.contactUsForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      message: [''],
      entity_id: [contentId, Validators.required],
      entity_type: ['Racetrack']
    })
  }

  private _getBookedDates(startDate, endDate) {
    let day1 = moment(endDate);
    let day2 = moment(startDate);
    let result = [moment({...day2})];

    while(day1.year() != day2.year() || day1.month() != day2.month() || day1.date() != day2.date()){
      day2.add(1, 'day');
      result.push(moment({ ...day2 }));
    }
    this.datePickerConfig.datesDisabled = result.map(x => new Date(x.format("YYYY-MM-DD")));

    // this.datePickerConfig.datesDisabled.forEach(d => {
    //   this.datePickerConfig.dateTooltipTexts.push({date: d, tooltipText: 'N/A'});
    // });
    
    this.isShowCalender = true;
  }


  async submitContact() {
    let formValue = this.contactUsForm.value;
    this._ngxSpinnerSvc.show();
    let responce = await this._apiSvc.post(`/contact-us`, formValue);
    if (responce && responce.code === 200 && responce.status === true) {
      this._toastrSvc.success('Success', 'Record Created Successfully.');
      this.modalRef.hide();
      this.contactUsForm.reset();
    } else {
      this._toastrSvc.error('Error', 'Something went wrong');
    }
    this._ngxSpinnerSvc.hide();
  }


}
