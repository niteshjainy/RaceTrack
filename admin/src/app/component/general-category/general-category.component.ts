import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { FormService } from '../../service/form/form.service';
import { CookieService } from 'ngx-cookie-service';
import $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-general-category',
  templateUrl: './general-category.component.html',
  styleUrls: ['./general-category.component.css']
})
export class GeneralCategoryComponent implements OnInit {
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private cookieService: CookieService,
              private router: Router,
              public formService: FormService,
              private api: ApiService,
              private _ngxSpinnerSvc: NgxSpinnerService,
              private _toastrSvc: ToastrService
  ) { }

  public form: FormGroup;
  // categories: any = [];
  public categoryConfig;
  submitted = false;
  userData: any;
  public filter: any;
  public count: number;
  dotPage = false;
  dotPage1 = false;
  userId = 'user_id';
  public list: any;
  public term: any;
  CatData: any = {};
  category: any;
  categorys: any;
  CatDataStatus: any;
  CatDataError: any;
  public loaderImage = false;
  catrgoryData: any;
  responseData: any;
  message: any;
  showClick = false;
  currentPage = 1;
  maxSize = 5;
  deleteId;

  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      desc: ['', [Validators.required]],
    });
    this.userData = JSON.parse(this.cookieService.get('login'));
    this.userId = this.userData.user_id;
    this.categoryList();
  }

  async addCategory() {
    this._ngxSpinnerSvc.show();
    this.submitted = true;
    if (this.form.value.name === '' && this.form.value.desc) {
    } else {
      try {
        const data: any = await this.api.post('/admin/add_category', this.form.value);
        if (data.status === true) {
          $('.close').click();
          this.form.reset();
          this._toastrSvc.success('Success', data.message);
          this.categoryList();
        } else {
          this._ngxSpinnerSvc.hide();
          this._toastrSvc.error('Error', data.message);
        }
      } catch(error) { 
        this._ngxSpinnerSvc.hide();
        this._toastrSvc.success('Error', error);
      }
    }
  }

  async categoryList() {
    try {
      const data = await this.api.get(`/admin/categories?pagination=1&page=${this.currentPage}`);
      if (data.status === true) {
        // this.categories = Object.values(data.data.data)
        this.categoryConfig = data.data;
      } 
      this._ngxSpinnerSvc.hide();
    }
    catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error);
    }
  }

  async changeStatus(status, id) {

    try {
      const datas = await this.api.post('/admin/change_status', {status: status, id: id,type: 'Category'});
      this._toastrSvc.success('Success', datas.message);
      this.categoryList();
    } catch (error) {
      this._toastrSvc.error('Error', error);
    }

  }
  async updateCategory() {
    this._ngxSpinnerSvc.show();
    try {
        let data = await this.api.post('/admin/update_category', this.catrgoryData);
        this.responseData = data.response;
        if (data.status === true) {
          $('.close').click()
          this._toastrSvc.success('Success', data.message);
          this.categoryList()
        } else{
          this._toastrSvc.error('Error', data.message);
          this._ngxSpinnerSvc.hide();
        }
      } catch (error) {
        this._toastrSvc.error('Error', error);
        this._ngxSpinnerSvc.hide();
      }
    }
    
    EditForm(AllData) {
      this.showClick = true;
      this.catrgoryData = AllData;
      this.catrgoryData.name = AllData.name;
      this.catrgoryData.desc = AllData.desc;
      this.catrgoryData.id = AllData.id;
    }

    pageChanged(e) {
      this._ngxSpinnerSvc.show();
      this.currentPage = e.page;
      this.categoryList();
    }
    async deleteSubmit() {
      this._ngxSpinnerSvc.show();
      try {
       let url = `/admin/delete_category?id=${this.deleteId}`;
       // let data = await this.api.post('/admin/delete_category', {id:this.deleteId});
       let data = await this.api.get(url)
  
        if (data && data.status) {
          this.form.reset();
          $('.close').click();
          this._toastrSvc.success('Success', data.message);
          this.categoryList()
        } else {
          this._toastrSvc.error('Error', data.message);
          this.categoryList()
        }
      } catch (error) {
        this._toastrSvc.error('Error', error);
        this.categoryList()
      }
    }
  
    deleteAction(id) {
      this.deleteId = id;
    }

}
