import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  racetrackList = [];
  categoriesList = [];
  typesList = [];
  equipmentsList = [];
  servicemansList = [];

  private _contantLoadState = {
    raceTrack: false,
    category: false,
    type: false,
    equipment: false,
    service: false
  };

  constructor( private api: ApiService, private _ngxSpinnerSvc: NgxSpinnerService) { }
  ngOnInit() {
    console.log("inside dashboard")
    this._ngxSpinnerSvc.show();
        this.recentRacetracks();
        this.recentCategories();
        this.recentTypes();
        this.recentEquipments();
        this.recentServicemans();
  }

  async recentRacetracks() {
    try {
      let data = await this.api.get('/admin/racetracks');
      console.log(data)
      if (data.status === true) {
        this.racetrackList = data.data.data;
        console.log(this.racetrackList)
      }
      this._contantLoadState.raceTrack = true;
      this._stopLoader();
    }
    catch (error) {
      alert(error);
      this._contantLoadState.raceTrack = true;
      this._stopLoader();
    }
  }

  async recentCategories() {
    try {
      let data = await this.api.get('/admin/categories');
      if (data.status === true) {
        this.categoriesList = data.data;
      } 
      this._contantLoadState.category = true;
      this._stopLoader();
    }
    catch (error) {
      alert(error);
      this._contantLoadState.category = true;
      this._stopLoader();
    }
  }

  async recentTypes() {
    try {
      let data = await this.api.get('/admin/types');
      if (data.status === true) {
        this.typesList = data.data;
      }
      this._contantLoadState.type = true;
      this._stopLoader();
    }
    catch (error) {
      alert(error);
      this._contantLoadState.type = true;
      this._stopLoader();
    }
  }

  async recentEquipments() {
    try {
      let data = await this.api.get('/admin/equipments');
      if (data.status === true) {
        this.equipmentsList = data.data;
      }
      this._contantLoadState.equipment = true;
      this._stopLoader();
    }
    catch (error) {
      alert(error);
      this._contantLoadState.equipment = true;
      this._stopLoader();
    }
  }

  async recentServicemans() {
    try {
      let data = await this.api.get('/admin/servicemans');
      if (data.status === true) {
        this.servicemansList = data.data;
      }
      this._contantLoadState.service = true;
      this._stopLoader();
    }
    catch (error) {
      alert(error);
      this._contantLoadState.service = true;
      this._stopLoader();
    }
  }

  private _stopLoader() {

    if (this._contantLoadState.raceTrack && 
      this._contantLoadState.category && 
      this._contantLoadState.type && 
      this._contantLoadState.equipment &&
      this._contantLoadState.service) {
        this._ngxSpinnerSvc.hide();
      }
 
  }
}
