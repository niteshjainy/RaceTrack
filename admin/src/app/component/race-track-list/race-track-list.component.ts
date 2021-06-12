import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../service/form/form.service';
import { CookieService } from 'ngx-cookie-service';
import $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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
  public typeDropdownSettings: any = {};
  public serverEquipments = [];
  public deleteEquipments = [];
  public deleteEquipmentID = [];
  public servicemanList = [];
  public servicemandropdownSettings: any = {};
  public serverServicemans = [];
  public deleteServicemans = [];
  public deleteServicemanID = [];
  public selectedTypes = [];
  public imageBaseUrl: string = "";


  config = {
    action: 'add',
    editData: {
      id: null,
      images: {
        images: [],
        deleteImages: []
      },
      servicemans: [],
      equipments: []
    },
    deleteId: null
  }

  currentPage = 1;
  maxSize = 5;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    public formService: FormService,
    private api: ApiService,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _toastrSvc: ToastrService) { }
  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.RacetrackList();
    
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
    this.typeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      enableCheckAll : false,
      allowSearchFilter: false
    };
    this.createForm()
    
  }

  private createForm() {
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
      servicemans: [[]],
      city: ['', Validators.required],
      is_featured: [0, Validators.required],
      race_lat: ['', Validators.required],
      race_long: ['', Validators.required],
    });
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
      this._toastrSvc.error('Error', error);
    }
  }

  async getTypesList() {
    try {
      const data = await this.api.get('/admin/types?status=Active');
      if (data.status === true) {
        this.typesList = data.data;
      }
    } catch (error) {
      this._toastrSvc.error('Error', error);
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
      this._toastrSvc.error('Error', error);
    }
  }

  async RacetrackList() {
      const data = await this.api.get(`/admin/racetracks?pagination=1&page=${this.currentPage}`);
      if (data.status === true) {
        this.racetrackConfig = data.data;
        this._createImgPath();
      } else {
        this._toastrSvc.error('Error', data.error);
      }
      this._ngxSpinnerSvc.hide();

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
    
    if (this.form.invalid) {
      this._toastrSvc.error('Error', 'Please Fill All Required Input Fields.');
      return;
    }
    let types = this.form.get('type_id').value
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
    // formData.append('type_id', this.form.get('type_id').value);
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
    formData.append('city', this.form.get('city').value);
    formData.append('is_featured', this.form.get('is_featured').value);
    formData.append('race_lat', this.form.get('race_lat').value);
    formData.append('race_long', this.form.get('race_long').value);
    
    // this.equipments.forEach(equipElem => {
    //   formData.append('equipments[]', equipElem);
    // });
    // this.servicemans.forEach(smElem => {
    //   formData.append('servicemans[]', smElem);
    // });
    if(this.equipments && this.equipments.length) {
      this.equipments.forEach(item => {
        formData.append('equipments[]', item);
      })
    }
    if(this.servicemans && this.servicemans.length) {
      this.servicemans.forEach(item => {
        formData.append('servicemans[]', item);
      })
    }
    if (types.length > 0){
      types.forEach(item => {
        formData.append('type_id[]', item.id)
      })
    }
    // formData.append('equipments[]', JSON.stringify(this.equipments));
    // formData.append('servicemans[]', JSON.stringify(this.servicemans));

    this._ngxSpinnerSvc.show();
    try {
      let data;
      let url = ''
      if(this.config.action == 'add') {
        url = '/admin/add_racetrack';

        this.images.forEach(imgElem => {
          formData.append('images[]', imgElem);
        });

        data = await this.api.post(url, formData)
      } else {
        url = '/admin/update_racetrack';
        formData.append('id', this.config.editData.id);
        this.images.forEach(imgElem => {
          formData.append('new_images[]', imgElem);
        });

        if(this.config.editData.images.deleteImages && this.config.editData.images.deleteImages.length) {
          this.config.editData.images.deleteImages.forEach(item => {
            formData.append('delete_images[]', item);
          })
        }

        data = await this.api.post(url, formData)
      }
      if (data && data.status) {
        this.form.reset();
        $('.close').click();
        this._toastrSvc.success('Success', data.message);
        this.RacetrackList();
      } else {
        this._toastrSvc.error('Error', data.message);
        this.RacetrackList();
      }
    } catch (error) {
      this._toastrSvc.error('Error', error);
      this.RacetrackList();
    }
  }

  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      const datas = await this.api.post('/admin/change_status', { status: status, id: id, type: 'Racetrack' });
      this.RacetrackList();
      this._toastrSvc.success('Success', datas.message);
    } catch (error) {
      this._toastrSvc.error('Error', error);
      this._ngxSpinnerSvc.hide();
    }
  }

  async usersAsOwners() {
    try {
      const data = await this.api.get('/admin/users?status=Active');
      this.allUsers = data.data;
    } catch (error) {
      this._toastrSvc.error('Error', error);
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

  EditForm(values) {
    this.images = [];
    this.config.action = 'edit';
    console.log(values, 'values');
    values.type_id = JSON.parse(values.type_id)
    console.log(this.typesList)
    this.config.editData.id = values.id;

    this._createImgPathEditForm(values);
    this.form.patchValue({
      name: values.name || '',
      desc: values.desc || '',
      distance: values.distance || '',
      type_id: values.type_id || '',
      owner_contact: values.owner_contact || '',
      owner_id: +values.owner_id || '',
      owner_email: values.owner_email || '',
      address: values.address || '',
      responsible_person: values.responsible_person || '',
      allocation_start_date: new Date(values.allocation_start_date) || '',
      allocation_end_date: new Date(values.allocation_end_date) || '',
      allocation_time: values.allocation_time || '',
      video_link: values.video_link || '',
      rating: values.rating || '',
      shared: values.shared || 0,
      city: values.city || '',
      is_featured: values.is_featured || 0,
      race_lat: values.race_lat || '',
      race_long: values.race_long || '',
    });

    // For Equipment
    if(values && values.racetrack_equipments && values.racetrack_equipments.length ) {
      this.config.editData.equipments = this._createMultiSelectData(values.racetrack_equipments, 'equipment');
    }

    // For Serviceman
    if(values && values.racetrack_servicemans && values.racetrack_servicemans.length ) {
      this.config.editData.servicemans = this._createMultiSelectData(values.racetrack_servicemans, 'serviceman');
    }

    
  }

  private _createImgPath() {
    if (this.racetrackConfig && this.racetrackConfig.data && this.racetrackConfig.data.length) {
      this.racetrackConfig.data.map(data => {
        if (data.images && data.images != 'null') {
          let imgArr: Array<string> = JSON.parse(data.images);
          if (imgArr && imgArr.length) {
            data.imageUrl = `${this.api.imgBasePath}/${data.image_uid}/${imgArr[0]}`;
          } else {
            data.imageUrl = null;
          }
        }
      })
    }
  }

  private _createImgPathEditForm(values) {
    this.config.editData.images.images = [];
    this.config.editData.images.deleteImages = [];

    if (values.images) {
      let imgArr: Array<string> = JSON.parse(values.images);
      if (imgArr && imgArr.length) {
        imgArr.forEach(item => {
          this.config.editData.images.images.push({url:`${this.api.imgBasePath}/${values.image_uid}/${item}`, name: item});
        })
      } else {
        this.config.editData.images.images = [];
      }
    }
  }

  private _createMultiSelectData(data, status) {
    let result = [];
    if(status === 'equipment') {
      data.forEach(item => {
        result.push({id: item.equipments.id, name: item.equipments.name})
      });
    }
    if(status === 'serviceman') {
      data.forEach(item => {
        result.push({id: item.servicemans.id, name: item.servicemans.name})
      });
    }

    return result;
  }
  pageChanged(e) {
    this._ngxSpinnerSvc.show();
    this.currentPage = e.page;
    this.RacetrackList();
  }

  deleteImage(ind, imageName) {
    this.config.editData.images.images.splice(ind, 1);
    this.config.editData.images.deleteImages.push(imageName);
  }

  addAction() {
    this.config.action = 'add';
    this.form.reset();
    this.images = [];
  }

  async deleteSubmit() {
    this._ngxSpinnerSvc.show();
    try {
      let url = `/admin/delete_racetrack?id=${this.config.deleteId}`;
      let data = await this.api.get(url)
   
      if (data && data.status) {
        this.form.reset();
        $('.close').click();
        this._toastrSvc.success('Success', data.message);
        this.RacetrackList();
      } else {
        this._toastrSvc.error('Error', data.message);
        this.RacetrackList();
      }
    } catch (error) {
      this._toastrSvc.error('Error', error);
      this.RacetrackList();
    }
  }

  deleteAction(id) {
    this.config.deleteId = id;
  }

}
