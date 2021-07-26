import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormService } from '../../service/form/form.service';
import { CookieService } from 'ngx-cookie-service';
//import { IDropdownSettings } from 'ng-multiselect-dropdown';
import $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
// import { element } from '@angular/core/src/render3';
// import { get } from 'http';

@Component({
  selector: 'app-race-track-list',
  templateUrl: './race-track-list.component.html',
  styleUrls: ['./race-track-list.component.css']
})
export class RaceTrackListComponent implements OnInit {
  public form: FormGroup;
  // racetracklist = [];
  racetrackConfig;
  submitted = false;
  allUsers = [];
  images = [];
  equipments = [];
  servicemans = [];

  public addracetrackData;
  public addracetrackDataStatus;
  public addracetrackDataError;
  public getStartMonth;
  public getEndMonth;
  public startDate;
  public endDate;
  public StartDate;
  public EndDate;
  public StartDateeVENT;
  public EndDateeVENT;
  public imagesFiles = [];
  public equipmentList = [];
  public typesList = [];
  public equipmentdropdownSettings: any = {};
  public serverEquipments = [];
  public deleteEquipments = [];
  public deleteEquipmentID = [];
  public servicemanList = [];
  public servicemandropdownSettings: any = {};
  public serverServicemans = [];
  public deleteServicemans = [];
  public deleteServicemanID = [];
  public imageBaseUrl: string = "";
  public racetrack_data: any = {};
  public showClick = false;
  currentPage = 1;
  maxSize = 5;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    public formService: FormService,
    private api: ApiService,
    private _ngxSpinnerSvc: NgxSpinnerService) { }
  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.RacetrackList();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      distance: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      owner_contact: ['', [Validators.required]],
      owner_id: ['', [Validators.required]],
      owner_email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      responsible_person: ['', [Validators.required]],
      allocation_start_date: ['', [Validators.required]],
      allocation_end_date: ['', [Validators.required]],
      allocation_time: ['', [Validators.required]],
      video_link: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      shared: ['', [Validators.required]],
      images: [[]],
      equipments: [[]],
      servicemans: [[]]
    });
    this.getServicemanList();
    this.getEquipmentList();
    this.usersAsOwners();
    this.getTypesList();
    this.deleteEquipments = [];
    this.deleteServicemans = [];
    this.imageBaseUrl = "http://ec2-54-229-105-99.eu-west-1.compute.amazonaws.com/racetrack/server/public/images/Racetracks";

    // Equipment Settings
    this.equipmentdropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    // Serviceman Settings
    this.servicemandropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onEquipmentItemSelect(item: any) {
    const i = this.deleteEquipments.findIndex(y => y.id === item.id);
    if (i != -1) {
      this.deleteEquipments.splice(i, 1);
    }
    this.equipments.push(item.id);
    console.log("this.equipments", this.equipments);
  }

  onEquipmentDeSelect(item: any) {
    this.equipments.splice(this.equipments.findIndex(y => y.id === item.id), 1);
    const l = this.serverEquipments.find(y => y.id === item.id);
    if (l) {
      this.deleteEquipments.push(l);
    }
  }

  async getEquipmentList() {
    try {
      const data = await this.api.get('/admin/equipments');
      if (data.status === true) {
        this.equipmentList = data.data;
        console.log('equipmentList', this.equipmentList);
      }
    }
    catch (error) {
      alert(error)
    }
  }

  async getTypesList() {
    try {
      const data = await this.api.get('/admin/types?status=Active');
      if (data.status === true) {
        this.typesList = data.data;
      }
    } catch (error) {
      alert(error)
    }

  }

  onServicemanItemSelect(item: any) {
    const i = this.deleteServicemans.findIndex(y => y.id === item.id);
    if (i != -1) {
      this.deleteServicemans.splice(i, 1);
    }
    this.servicemans.push(item.id);
    console.log("this.servicemans", this.servicemans);
  }

  onServicemanDeSelect(item: any) {
    this.servicemans.splice(this.servicemans.findIndex(y => y.id === item.id), 1);
    const l = this.serverServicemans.find(y => y.id === item.id);
    if (l) {
      this.deleteServicemans.push(l);
    }
  }

  async getServicemanList() {
    try {
      const data = await this.api.get('/admin/servicemans?status=Active');
      if (data.status === true) {
        this.servicemanList = data.data;
      }
    }
    catch (error) {
      alert(error)
    }
  }

  async RacetrackList() {
    try {
      const data = await this.api.get(`/admin/racetracks?pagination=${this.currentPage}`);
      if (data.status === true) {
        // var racetracks = data.data.data;
        // racetracks.forEach(rtElem => {
        //   var rt_images = rtElem.images;
        //   rtElem.images = JSON.parse(rt_images);
        // });
        // this.racetracklist = data.data.data;
        this.racetrackConfig = data.data;
        this._createImgPath();
        // console.log(racetracks);
      }
      this._ngxSpinnerSvc.hide();
    }
    catch (error) {
      alert(error);
      this._ngxSpinnerSvc.hide();
    }
  }

  onChangeStart(event) {
    console.log("event", event);
    this.StartDateeVENT = event;
  }

  onChangeEnd(event) {
    this.EndDateeVENT = event;
  }

  // setId() {
  //   this.form.controls.id.setValue(this.form.controls.owner_id.value);
  // }

  async addracetrackForm() {
    console.log(this.form.get('images').value);
    const StartDate = new Date(this.StartDateeVENT);
    const EndDate = new Date(this.EndDateeVENT);
    this.submitted = true;

    if ((StartDate.getMonth() + 1) < 10) {
      this.getStartMonth = '0' + (StartDate.getMonth() + 1);
    } else {
      this.getStartMonth = (StartDate.getMonth() + 1);
    }
    if ((StartDate.getDate()) < 10) {
      this.startDate = '0' + StartDate.getDate();
    } else {
      this.startDate = StartDate.getDate();
    }
    if ((EndDate.getMonth() + 1) < 10) {
      this.getEndMonth = '0' + (EndDate.getMonth() + 1);
    } else {
      this.getEndMonth = (EndDate.getMonth() + 1);
    }
    if ((EndDate.getDate()) < 10) {
      this.endDate = '0' + EndDate.getDate();
    } else {
      this.endDate = EndDate.getDate();
    }

    const formData = new FormData();
    formData.append('name', this.form.get('name').value);
    formData.append('desc', this.form.get('desc').value);
    formData.append('distance', this.form.get('distance').value);
    formData.append('type_id', this.form.get('type_id').value);
    formData.append('owner_contact', this.form.get('owner_contact').value);
    formData.append('owner_id', this.form.get('owner_id').value);
    formData.append('owner_email', this.form.get('owner_email').value);
    formData.append('address', this.form.get('address').value);
    formData.append('responsible_person', this.form.get('responsible_person').value);
    formData.append('allocation_start_date', StartDate.getFullYear() + '-' + this.getStartMonth + '-' + this.startDate);
    formData.append('allocation_end_date', EndDate.getFullYear() + '-' + this.getEndMonth + '-' + this.endDate);
    formData.append('allocation_time', this.form.get('allocation_time').value);
    formData.append('video_link', this.form.get('video_link').value);
    formData.append('rating', this.form.get('rating').value);
    formData.append('shared', this.form.get('shared').value);
    this.images.forEach(imgElem => {
      formData.append('images[]', imgElem);
    });
    this.equipments.forEach(equipElem => {
      formData.append('equipments[]', equipElem);
    });
    this.servicemans.forEach(smElem => {
      formData.append('servicemans[]', smElem);
    });

    this._ngxSpinnerSvc.show();
    try {
      const data = await this.api.post('/admin/add_racetrack', formData);
      this.addracetrackData = data;
      this.addracetrackDataStatus = data.status;
      this.addracetrackDataError = data.message;
      if (this.addracetrackData == true) {
        this.form.reset();
        $('.close').click();
        alert(this.addracetrackDataError);
        this.RacetrackList();
      } else {
        alert(this.addracetrackDataError);
        this.RacetrackList();
      }
    } catch (error) {
      alert(error);
      this.RacetrackList();
    }
  }

  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      const datas = await this.api.post('/admin/change_status', { status: status, id: id, type: 'Racetrack' });
      this.RacetrackList();
    } catch (error) {
      alert(error);
      this._ngxSpinnerSvc.hide();
    }
  }

  async usersAsOwners() {
    try {
      const data = await this.api.get('/admin/users?status=Active');
      this.allUsers = data.data;
    } catch (error) {
      alert(error)
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.images.push(event.target.files[i]);
      }
    }
  }

  EditForm(racetrack_data) {
    console.log(racetrack_data);
    this.showClick = true;
    this.racetrack_data = racetrack_data;
  }

  private _createImgPath() {
    if (this.racetrackConfig && this.racetrackConfig.data && this.racetrackConfig.data.length) {
      this.racetrackConfig.data.map(data => {
        if (data.images) {
          let imgArr: Array<string> = JSON.parse(data.images);
          if (imgArr.length) {
            data.imageUrl = `${this.api.imgBasePath}/${data.image_uid}/${imgArr[0]}`;
          } else {
            data.imageUrl = null;
          }
        }
      })
    }
  }

  pageChanged(e) {
    this._ngxSpinnerSvc.show();
    this.currentPage = e.page;
    this.RacetrackList();
  }

}
