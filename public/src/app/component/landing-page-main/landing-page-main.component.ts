import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-landing-page-main',
  templateUrl: './landing-page-main.component.html',
  styleUrls: ['./landing-page-main.component.css']
})
export class LandingPageMainComponent implements OnInit {

  raceTrackForm: FormGroup;
  @ViewChild('traceSlide', {read: DragScrollComponent}) ds: DragScrollComponent;
  raceTracks: Array<{[key: string]: any}> = [];
  formMinDate: any = new Date()
  toMinDate: any;
  // inputStatus = {
  //   searchLoc: true,
  //   availabilityFrom: true,
  //   availabilityTo: true
  // };
  autoCompleteData = {
    state: {
      keyword: 'state',
      placeHolder: 'Search State',
      data: []
    },
    city: {
      keyword: 'city',
      placeHolder: 'Search City',
      data: []
    },
    country: {
      keyword: 'country',
      placeHolder: 'Search Country',
      data: [],
      initialValue: ''
    }
  }
  datePickerConfig = { containerClass: 'theme-red', dateInputFormat: 'YYYY-MM-DD', isAnimated: true };
  // states: Array<{[key: string]: string}> = [];
  // cities: Array<{[key: string]: string}> = [];

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _apiSvc: ApiService
  ) { }

  ngOnInit() {
    this._createForm();
    this._getFeaturedRaceTracks();
  }

  setToMinDate(event: any) {
    console.log(event)
    this.toMinDate = event
  }

  private _createForm() {
    this.raceTrackForm = this._fb.group({
      locationFor: [''],
      state: [''],
      country: [''],
      city: [''],
      searchLoc: [''],
      raceTrack: ['All', Validators.required],
      availabilityFrom: [''],
      availabilityTo: [''],
    })
  }

  submitRaceTrack() {
    let formValue = this.raceTrackForm.value;
    formValue.availabilityFrom = this._getDate(formValue.availabilityFrom);
    formValue.availabilityTo = this._getDate(formValue.availabilityTo);
    let data = { 
      locationFor: formValue.locationFor, 
      searchLoc: formValue.searchLoc, 
      raceTrack: formValue.raceTrack, 
      availabilityFrom: formValue.availabilityFrom, 
      availabilityTo: formValue.availabilityTo,
      city: formValue.city.city,
      state: formValue.state.state,
      country: formValue.country.country,
    }
    this._router.navigate(['/raceTracks'], { queryParams: data });
  }

  private _getDate(date): string {
    let month: any = new Date(date).getMonth() + 1;
    let year: number = new Date(date).getFullYear();
    let dateNo: any = new Date(date).getDate();

    if(Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(dateNo)) {
      return '';
    }

    if(dateNo < 10) dateNo = '0'+ dateNo;
    if(month < 10) month = '0'+ month;
    
    return `${year}-${month}-${dateNo}`;
  }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  private async _getFeaturedRaceTracks() {
    this._ngxSpinnerSvc.show();
    let responce = await this._apiSvc.get(`/get-featured-rts`);
    if (responce && responce.code === 200 && responce.status === true) {
      this.raceTracks = responce.data;
      if (this.raceTracks) {
        this._createImgPath();
      }
    } else {
      this.raceTracks = [];
    }
    //this._getStates();
    this._getCountry();
    
  }


  private _createImgPath() {
    this.raceTracks.map(data => {
      if (data.images) {
        let imgArr: Array<string> = JSON.parse(data.images);
        if (imgArr.length) {
          data.imageUrl = `${this._apiSvc.imgBasePath}/${data.image_uid}/${imgArr[0]}`;
        } else {
          data.imageUrl = null;
        }
      }
    })
  }

  private async _getStates() {
    let responce = await this._apiSvc.get(`/admin/states`);
    if (responce && responce.code === 200 && responce.status === true) {
      this.autoCompleteData.state.data = responce.data;
      // this.states.map(item => {
      //   item.name = item.state;
      //   delete item.state;
      //   return item;
      // })
    } else {
      this.autoCompleteData.state.data = [];
    }
    this._ngxSpinnerSvc.hide();
  }
  private async _getCountry() {
    let responce = await this._apiSvc.get(`/admin/countries`);
    if (responce && responce.code === 200 && responce.status === true) {
      this.autoCompleteData.country.data = responce.data;
      // this.states.map(item => {
      //   item.name = item.state;
      //   delete item.state;
      //   return item;
      // })
    } else {
      this.autoCompleteData.country.data = [];
    }
    this._ngxSpinnerSvc.hide();
  }
  private async _getCities(country) {
    let responce = await this._apiSvc.post(`/admin/cities`, country);
    if (responce && responce.code === 200 && responce.status === true) {
      this.autoCompleteData.city.data = responce.data;
    } else {
      this.autoCompleteData.city.data = [];
    }
    this._ngxSpinnerSvc.hide();
  }

  selectEvent(e, status) {
    if(status === 'city') {
      this.raceTrackForm.patchValue({ searchLoc: e.city });
    } else {
      this._getCities(e);
      this.raceTrackForm.patchValue({ searchLoc: '', city: '' });
    }
    console.log(e);
  }

}
