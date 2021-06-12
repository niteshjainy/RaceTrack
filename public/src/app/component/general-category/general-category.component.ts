import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { FormService } from '../../service/form/form.service';
import { CookieService } from 'ngx-cookie-service';
import $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';

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
              private _ngxSpinnerSvc: NgxSpinnerService
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
          alert(data.message);
          this.categoryList();
        } else {
          this._ngxSpinnerSvc.hide();
          alert(data.message);
        }
      } catch(error) { 
        this._ngxSpinnerSvc.hide();
        alert(error);
      }
    }
  }

  async categoryList() {
    try {
      const data = await this.api.get(`/admin/categories?pagination=${this.currentPage}`);
      if (data.status === true) {
        // this.categories = Object.values(data.data.data)
        this.categoryConfig = data.data;
      } 
      this._ngxSpinnerSvc.hide();
    }
    catch (error) {
      alert(error);
      this._ngxSpinnerSvc.hide();
    }
  }

  async changeStatus(status, id) {

    try {
      const datas = await this.api.post('/admin/change_status', {status: status, id: id,type: 'Category'});
      this.categoryList();
    } catch (error) {
      alert(error);
    }

  }
  async updateCategory() {
    this._ngxSpinnerSvc.show();
    try {
        let data = await this.api.post('/admin/update_category', this.catrgoryData);
        this.responseData = data.response;
        if (data.status === true) {
          $('.close').click()
          alert(data.message)
          this.categoryList()
        } else{
          alert(this.message)
          this._ngxSpinnerSvc.hide();
        }
      } catch (error) {
        alert(error);
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
  

}
