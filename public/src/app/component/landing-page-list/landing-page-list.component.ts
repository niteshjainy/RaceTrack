import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-landing-page-list',
  templateUrl: './landing-page-list.component.html',
  styleUrls: ['./landing-page-list.component.css']
})
export class LandingPageListComponent implements OnInit {

  raceTrackObj: { [key: string]: any };
  isHideFilter: boolean = false;
  raceTrackForm: FormGroup;
  currentPage = 1;
  maxSize = 5;
  isFormShow: boolean = false;
  formMinDate: any = new Date()
  toMinDate: any;
  routeData: {[key: string]: any} = null;
  latitude;
  longitude;
  cityVal;
  countryVal;
  datePickerConfig = { containerClass: 'theme-red', dateInputFormat: 'YYYY-MM-DD', isAnimated: true };
  autoCompleteData = {
    state: {
      keyword: 'state',
      placeHolder: 'Search State',
      data: [],
      initialValue: ''
    },
    city: {
      keyword: 'city',
      placeHolder: 'Search City',
      data: [],
      initialValue: ''
    },
    country: {
      keyword: 'country',
      placeHolder: 'Search Country',
      data: [],
      initialValue: ''
    }
  }

  filterConfig = {
    // lookingFor: {
    //   all: false,
    //   raceTrack: false,
    //   equipment: false,
    //   serviceman: false
    // },
    lookingFor: 'all',
    rating: null,
    range_slider__value:100,
    latitude:null,
    longitude:null

  }

  constructor(
    private _actRoute: ActivatedRoute,
    private _apiSvc: ApiService,
    private _fb: FormBuilder,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._actRoute.queryParamMap.subscribe((data: any) => {
      this.routeData = data.params;
      this._getRaceTracks(data.params);
      this.cityVal = this.routeData.city?this.routeData.city:''
     // console.log( this.routeData,"intial")
    });
    this.getUserLocation();
    console.log(this.raceTrackForm)
  }

  setToMinDate(event:any){
    console.log(event)
    this.toMinDate = event
  }

  private async _getRaceTracks(val) {
    this._ngxSpinnerSvc.show();
    let apiPath = `/get-rts?`
    if (val.locationFor) {
      apiPath += `name=${val.locationFor}`;
    }
    if (val.availabilityFrom) {
      apiPath += `&start_date=${val.availabilityFrom}`;
    }
    if (val.availabilityTo) {
      apiPath += `&end_date=${val.availabilityTo}`;
    }
    if (val.searchLoc) {
      apiPath += `&location=${val.searchLoc}`;
    }
    if (val.raceTrack) {
      apiPath += `&type=${val.raceTrack}`;
    }else{
      this.raceTrackForm.patchValue({ raceTrack: 'All' });
      apiPath += `&type=All`;
    }
    if (this.currentPage) {
      apiPath += `&page=${this.currentPage}`;
    }
    if(this.filterConfig.rating) {
      apiPath += `&rating=${this.filterConfig.rating}`;
    }
    if(this.filterConfig.range_slider__value) {
      apiPath += `&range_slider__value=${this.filterConfig.range_slider__value}`;
    }
    if(this.filterConfig.latitude) {
      apiPath += `&latitude=${this.filterConfig.latitude}`;
    }
    if(this.filterConfig.longitude) {
      apiPath += `&latitude=${this.filterConfig.longitude}`;
    }

    let responce = await this._apiSvc.get(apiPath);

    if (responce && responce.code === 200 && responce.status === true) {
      this.raceTrackObj = responce.data;
      if (this.raceTrackObj && this.raceTrackObj.data && this.raceTrackObj.data.length) {
        this._createImgPath();
      }
      this._parseJsonOfMachenics();
    } else {
      this.raceTrackObj = null;
    }
    if(!this.autoCompleteData.state.data.length) {
     // this._getStates(); 
    } else {
      this._ngxSpinnerSvc.hide();
    }
    if(!this.autoCompleteData.country.data.length) {
      this._getCountry();
    } else {
      this._ngxSpinnerSvc.hide();
    }
    
  }

  private _createImgPath() {
    this.raceTrackObj.data.map(data => {
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

  private _createControls() {
    this.raceTrackForm = this._fb.group({
      locationFor: [''],
      state: [this.autoCompleteData.state.initialValue],
      city: [this.autoCompleteData.city.initialValue],
      country: [this.autoCompleteData.country.initialValue],
      searchLoc: [''],
      raceTrack: ['All'],
      availabilityFrom: [''],
      availabilityTo: [''],
    });

    this.isFormShow = true;
    
  }

  pageChanged(e) {
    this.currentPage = e.page;
    this.submitRaceTrack()
  }

  submitRaceTrack() {
    let formValue = this.raceTrackForm.value;
    formValue.availabilityFrom = this._getDate(formValue.availabilityFrom);
    formValue.availabilityTo = this._getDate(formValue.availabilityTo);
  //  console.log(formValue)
    this._getRaceTracks(formValue);
  }

  private _getDate(date): string {
    if (!date) {
      return null
    }
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

  private _setRaceTrackControlVal() {
    this.raceTrackForm.patchValue({
      locationFor: this.routeData.locationFor,
      searchLoc: this.routeData.searchLoc,
      raceTrack: this.routeData.raceTrack,
    });


    if(this.routeData.availabilityFrom) {
      this.raceTrackForm.patchValue({
        availabilityFrom: new Date(this.routeData.availabilityFrom)
      });
    }

    if(this.routeData.availabilityTo) {
      this.raceTrackForm.patchValue({
        availabilityTo: new Date(this.routeData.availabilityTo)
      });
    }

    this.filterConfig.lookingFor = this.routeData.raceTrack;

    // this.lookingForFilter(this.routeData.raceTrack);

  }

  goToRoute(raceTrack) {
 //   console.log("raceTrack",raceTrack)
    if(raceTrack.racetrack_equipments) {
      this._router.navigate(['/raceTracks', raceTrack.id]);
    }
  }

  private _parseJsonOfMachenics() {
    this.raceTrackObj.data.map(item => {
      if(item.specializations) {
        item.specializations = JSON.parse(item.specializations);
      }
    });
  }

  private async _getStates() {
    let responce = await this._apiSvc.get(`/admin/states`);
    if (responce && responce.code === 200 && responce.status === true) {
      this.autoCompleteData.state.data = responce.data;
    } else {
      this.autoCompleteData.state.data = [];
    }
    if(this.routeData.state) {
      this._getCities({state: this.routeData.state});
    } else {
      this._ngxSpinnerSvc.hide();
    }

    this.autoCompleteData.state.initialValue = this.routeData.state;
    this.autoCompleteData.city.initialValue = this.routeData.city;

    this._createControls();
    this._setRaceTrackControlVal();
    
  }
  private async _getCountry() {
    let responce = await this._apiSvc.get(`/admin/countries`);
    if (responce && responce.code === 200 && responce.status === true) {
      this.autoCompleteData.country.data = responce.data;
    } else {
      this.autoCompleteData.country.data = [];
    }
    if(this.routeData.country) {
      this._getCities({country: this.routeData.country});
    } else {
      this._ngxSpinnerSvc.hide();
    }

    this.autoCompleteData.country.initialValue = this.routeData.country;
    this.autoCompleteData.city.initialValue = this.routeData.city;

    this._createControls();
    this._setRaceTrackControlVal();
    
  }

  private async _getCitiesOld(state) {
    let responce = await this._apiSvc.post(`/admin/cities`, state);
    if (responce && responce.code === 200 && responce.status === true) {
      this.autoCompleteData.city.data = responce.data;
    } else {
      this.autoCompleteData.city.data = [];
    }
    this._ngxSpinnerSvc.hide();
  }
  private async _getCities(country) {
    console.log("countries",country.country)
    this.countryVal = country.country;
    let responce = await this._apiSvc.post(`/admin/cities`, country);
    if (responce && responce.code === 200 && responce.status === true) {
      this.autoCompleteData.city.data = responce.data;
    } else {
      this.autoCompleteData.city.data = [];
    }
    this._ngxSpinnerSvc.hide();
  }

  selectEvent(e, status) {
    if(typeof e === "string") {
      return;
    }
    if(status === 'city'){
      this.cityVal = e.city;
     // console.log("statusdata",e);
    }
    if(status === 'city') {
      this.raceTrackForm.patchValue({ searchLoc: e.city });
    } else {
      this._getCities(e);
      this.raceTrackForm.patchValue({ searchLoc: '', city: '' });
    }
 //   console.log(e);
  }

  onChangeSearch(e, status) {
   console.log("edata",e);
   
    if(status === 'city'){
      this.cityVal = e;
      console.log("statusdata",e);
    }
    if(!e || !e.length) {
      if(status === 'city') {
        this.raceTrackForm.patchValue({ searchLoc: e.city });
      } else {
        if(e && e.length) {
          this._getCities(e);
        }
        this.raceTrackForm.patchValue({ searchLoc: '', city: '' });
      }
    }
  }

  lookingForFilter(val) {
    switch(val) {

      case 'Racetrack':
        // this.filterConfig.lookingFor.raceTrack = true;
        break;

      case 'Equipment':
        // this.filterConfig.lookingFor.equipment = true;
        break;

      case 'Serviceman':
        // this.filterConfig.lookingFor.serviceman = true;
        break;

      default :
        // this.filterConfig.lookingFor.raceTrack = true;
        // this.filterConfig.lookingFor.equipment = true;
        // this.filterConfig.lookingFor.serviceman = true;

        // this.filterConfig.lookingFor.all = true;
        break;

    }
  }


  changeRacetrack(val) {
    this.raceTrackForm.patchValue({raceTrack: val});
    this.submitRaceTrack();
  }

  changeRating(val) {
    this.filterConfig.rating = val;
    this.submitRaceTrack();
  }
  getUserLocation() {
    // get Users current position

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log("position",position)
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // this.zoom = 16;
        //console.log("position", position)
      });
    }else{
      console.log("User not allowed")
    }
  }
    valueChanged(val) {
      this.filterConfig.range_slider__value = val;
      this.filterConfig.latitude = this.latitude;
      this.filterConfig.longitude = this.longitude
      this.submitRaceTrack();
    }

  resetForm(){
    this.cityVal='';
    this.countryVal='';
    this.raceTrackForm.reset()
  }


}
