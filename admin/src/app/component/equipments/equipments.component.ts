import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormService } from '../../service/form/form.service';
import * as moment from 'moment';
import $ from 'jquery';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.css']
})
export class EquipmentsComponent implements OnInit {

  constructor(
    private api: ApiService,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _fb: FormBuilder,
    private _toastrSvc: ToastrService,
    public formService: FormService) { }
  // equipmentsList: any;
  equipmentConfig;
  deleteId;
  currentPage = 1;
  maxSize = 5;
  timeAlloc: Date = new Date();
  form: FormGroup;
  datePickerConfig = { containerClass: 'theme-red', dateInputFormat: 'YYYY-MM-DD', isAnimated: true };
  images = [];
  config = {
    action: 'add',
    catList: null,
    subCatList: null,
    type: null,
    contentLoad: {
      equipment: true,
      cat: true,
      subCat: true,
      type: true
    },
    editData: {
      id: null,
      images: {
        images: [],
        deleteImages: []
      }
    }
  }


  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.Equipments();
    this._createForm();
    this.getCategories();
    this.getSubCategories();
    this.getTypes();
  }

  private _createForm() {
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      category_id: ['', Validators.required],
      subcategory_id: ['', Validators.required],
      type_id: ['', Validators.required],
      special_instructions: ['', Validators.required],
      allocation_start_date: ['', Validators.required],
      allocation_time: ['', Validators.required],
      end_allocation_time: ['', Validators.required],
      contact_no: ['', Validators.required],
      allocation_end_date: ['', Validators.required],
      email_id: ['', Validators.required],
      eq_lat: ['', Validators.required],
      eq_long: ['', Validators.required],
      rating: [0, [Validators.required, Validators.max(5), Validators.min(1)]],
      images: [[]],
      video_link: [''],
    })
  }

  async Equipments() {
    let data = await this.api.get(`/admin/equipments?pagination=1&page=${this.currentPage}`);
    console.log('Data===', data);
    if (data.status === true) {
      this.equipmentConfig = data.data;
    } else {
    }
    this.config.contentLoad.equipment = false;
    this._manageContentLoadStatus();
  }
  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      let datas = await this.api.post('/admin/change_status', { 'status': status, 'id': id, 'type': 'Equipment' })
      this._toastrSvc.success('Success', datas.message);
      this.Equipments();
    } catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error);
    }
  }

  pageChanged(e) {
    this._ngxSpinnerSvc.show();
    this.currentPage = e.page;
    this.Equipments();
  }
  async createEquipment() {
    if (this.form.invalid) {
        this._toastrSvc.error('Error', 'Please Fill All Required Input Fields.');
      return;
    }
    this.form.patchValue({
      allocation_start_date: moment(this.form.value.allocation_start_date).format("YYYY-MM-DD"),
      allocation_end_date: moment(this.form.value.allocation_end_date).format("YYYY-MM-DD"),
      allocation_time: moment(this.form.value.allocation_time).format("LT"),
      end_allocation_time: moment(this.form.value.end_allocation_time).format("LT")
    })
    const formVal = this.form.value;
    const formData = new FormData();
    formData.append('name', formVal.name);
    formData.append('desc', formVal.desc);
    formData.append('category_id', formVal.category_id);
    formData.append('subcategory_id', formVal.subcategory_id);
    formData.append('type_id', formVal.type_id);
    formData.append('special_instructions', formVal.special_instructions);
    formData.append('allocation_start_date', formVal.allocation_start_date);
    formData.append('allocation_time', formVal.allocation_time);
    formData.append('end_allocation_time', formVal.end_allocation_time);
    formData.append('contact_no', formVal.contact_no);
    formData.append('allocation_end_date', formVal.allocation_end_date);
    formData.append('email_id', formVal.email_id);
    formData.append('rating', formVal.rating);
    formData.append('video_link', (formVal.video_link || 'N/A'));
    formData.append('video_link', (formVal.video_link || 'N/A'));
    formData.append('eq_lat', (formVal.eq_lat ));
    formData.append('eq_long', (formVal.eq_long ));

    this._ngxSpinnerSvc.show();
    try {
      let datas;
      if (this.config.action == 'add') {

        this.images.forEach(imgElem => {
          formData.append('images[]', imgElem);
        });

        datas = await this.api.post('/admin/add_equipment', formData);
      } else {

        formData.append('id', this.config.editData.id);
        this.images.forEach(imgElem => {
          formData.append('new_images[]', imgElem);
        });
        formData.append('delete_images[]', JSON.stringify(this.config.editData.images.deleteImages));

        datas = await this.api.post('/admin/update_equipment', formData);
      }
      this.form.reset();
      $('.close').click();
      this.Equipments();
      this._toastrSvc.success('Success', datas.message);
    } catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error.message);
    }
  }

  addEquipemnt() {
    this.form.reset();
    this.config.action = 'add';
  }

  async getCategories() {
    let data = await this.api.get(`/admin/categories?status=Active`);
    if (data.status === true) {
      this.config.catList = data.data;
    } else {
      this.config.catList = null;
    }
    this.config.contentLoad.cat = false;
    this._manageContentLoadStatus();

  }

  async getSubCategories() {
    let data = await this.api.get(`/admin/subcategories?status=Active`);
    if (data.status === true) {
      this.config.subCatList = data.data;
    } else {
      this.config.subCatList = null;
    }
    this.config.contentLoad.subCat = false;
    this._manageContentLoadStatus();
  }

  async getTypes() {
    let data = await this.api.get(`/admin/types`);
    if (data.status === true) {
      this.config.type = data.data;
    } else {
      this.config.type = null;
    }
    this.config.contentLoad.type = false;
    this._manageContentLoadStatus();
  }


  private _manageContentLoadStatus() {
    if (
      this.config.contentLoad.equipment === false &&
      this.config.contentLoad.cat === false &&
      this.config.contentLoad.subCat === false &&
      this.config.contentLoad.type === false) {
      this._ngxSpinnerSvc.hide();
    }
  }

  hoveringOver(value: number): void {
    this.form.patchValue({ rating: value });
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.images.push(event.target.files[i]);
      }
    }
    console.log(this.images, 'this.images')
  }

  setForm(values) {
    this.config.action = 'edit';
    console.log(values, 'values');

    this.form.patchValue({
      name: values.name || '',
      desc: values.desc || '',
      category_id: values.category_id || '',
      subcategory_id: values.subcategory_id || '',
      type_id: values.type_id || '',
      special_instructions: values.special_instructions || '',
      allocation_start_date: new Date(values.allocation_start_date),
      contact_no: values.contact_no || '',
      allocation_end_date: new Date(values.allocation_end_date),
      email_id: values.email_id || '',
      rating: values.rating || 0,
      eq_lat: values.eq_lat || '',
      eq_long: values.eq_long || '',
      video_link: (values.video_link && values.video_link != 'null' ? values.video_link : '')
    });

    if (values.allocation_time && values.allocation_time.length > 0) {
      this.form.patchValue({
        allocation_time: new Date(moment(values.allocation_time, ["h:mm A"]).format())
      })
    }
    if (values.end_allocation_time && values.end_allocation_time.length > 0) {
      this.form.patchValue({
        end_allocation_time: new Date(moment(values.end_allocation_time, ["h:mm A"]).format())
      })
    }

    this.config.editData.id = values.id;

    this._createImgPath(values);

  }


  private _createImgPath(values) {
    this.config.editData.images.images = [];
    this.config.editData.images.deleteImages = [];

    if (values.images) {
      let imgArr: Array<string> = JSON.parse(values.images);
      if (imgArr.length) {
        imgArr.forEach(item => {
          this.config.editData.images.images.push({url:`${this.api.imgBasePath}/${values.image_uid}/${item}`, name: item});
        })
      } else {
        this.config.editData.images.images = [];
      }
    }
  }

  thumbNailImgPath(values, uid) {
    if (values) {
      let temp = [];
      let imgArr: Array<string> = JSON.parse(values);
      if (imgArr.length) {
        imgArr.forEach(item => {
          temp.push({ url: `${this.api.imgBasePath}/${uid}/${item}`, name: item });
        })
        // console.log('ma')
        // console.log(temp[0].url)
        return temp[0].url
      } 
    }
  }


  deleteImage(ind, imageName) {
    this.config.editData.images.images.splice(ind, 1);
    this.config.editData.images.deleteImages.push(imageName);
  }

  async deleteSubmit() {
    this._ngxSpinnerSvc.show();
    try {
      let url = `/admin/delete_equipment?id=${this.deleteId}`;
      let data = await this.api.get(url)

      if (data && data.status) {
        this.form.reset();
        $('.close').click();
        this._toastrSvc.success('Success', data.message);
        this.Equipments()
      } else {
        this._toastrSvc.error('Error', data.message);
        this.Equipments()
      }
    } catch (error) {
      this._toastrSvc.error('Error', error);
      this.Equipments()
    }
  }

  deleteAction(id) {
    this.deleteId = id;
  }


}
