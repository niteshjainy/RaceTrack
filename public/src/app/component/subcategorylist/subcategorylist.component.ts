import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service'
import { FormService } from '../../service/form/form.service'
import { CookieService } from "ngx-cookie-service";
import $ from "jquery";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-subcategorylist',
  templateUrl: './subcategorylist.component.html',
  styleUrls: ['./subcategorylist.component.css']
})
export class SubcategorylistComponent implements OnInit {
  public form: FormGroup;
  public submitted = false;
  subcategory;
  subcategoryConfig;
  generalcategories = [];
  // subcategories = [];
  subCatrgoryData: any = {};
  showClick = false;
  message;
  responseData;
  SubCatData;
  SubCatDataStatus;
  SubCatMessage;
  currentPage = 1;
  maxSize = 5;
  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private cookieService: CookieService, 
    private router: Router, 
    public formService: 
    FormService, 
    private api: ApiService,
    private _ngxSpinnerSvc: NgxSpinnerService) {
  }
  ngOnInit() {
    this._ngxSpinnerSvc.show();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
    })
    this.SubCategory()
    this.GeneralCategory()
  }

  async SubCategory() {
    try {
      let data = await this.api.get(`/admin/subcategories?pagination=${this.currentPage}`);
      if (data.status == true) {
        // this.subcategories = data.data.data;   
        this.subcategoryConfig = data.data;   
      }
      this._ngxSpinnerSvc.hide();
    } 
    catch (error) {
      alert(error);
      this._ngxSpinnerSvc.hide();
    }
  }

  async GeneralCategory() {
    try {
      let data = await this.api.get("/admin/categories?status=Active");
      if (data.status == true) {
        this.generalcategories = data.data;
      } 
    }
    catch (error) {
      alert(error)
    }
  }

  // setId() {
  //   this.form.controls['id'].setValue(this.form.controls['category_id'].value);
  // }

  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      const datas = await this.api.post('/admin/change_status', {status: status, id: id,type: 'Subcategory'});
      this.SubCategory()
    } catch (error) {
      alert(error);
      this._ngxSpinnerSvc.hide();
    }
  }
   
  EditForm(AllData) {
    this.showClick = true;
    this.subcategory = AllData;
    this.subCatrgoryData.name = this.subcategory.name;
    this.subCatrgoryData.desc = this.subcategory.desc;
    this.subCatrgoryData.category_id = this.subcategory.categories.id;
    this.subCatrgoryData.category_name = this.subcategory.categories.name;
    this.subCatrgoryData.id = this.subcategory.id;
  }

  async addsubCatForm() {
    this._ngxSpinnerSvc.show();
    try {
          let data = await this.api.post('/admin/add_subcategory', this.form.value)
          this.SubCatDataStatus = data.status;
          this.SubCatMessage = data.message;
          if (this.SubCatDataStatus == true) {
            $('.close').click()
            alert(this.SubCatMessage)
            this.SubCategory()
          } else{
            alert(this.SubCatMessage);
            this._ngxSpinnerSvc.hide();
          }
      }
      catch (error) { 
        alert(error);
        this._ngxSpinnerSvc.hide();
      }
  }

  async updateSubCatForm() {
    this._ngxSpinnerSvc.show();
    try {
        delete(this.subCatrgoryData.category_name);
        let data = await this.api.post('/admin/update_subcategory', this.subCatrgoryData);
        this.message = data.message;
        this.responseData = data.response;
        if (data.status === true) {
          alert(this.message)
          $('.close').click()
          this.SubCategory()
        } else{
          alert(this.message);
          this._ngxSpinnerSvc.hide();
        }
      } catch (error) {
        alert(error);
        this._ngxSpinnerSvc.hide();
      }
    }

    pageChanged(e) {
      this._ngxSpinnerSvc.show();
      this.currentPage = e.page;
      this.SubCategory();
    }

}
