import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service'
import { FormService } from '../../service/form/form.service'
import $ from "jquery";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  subCatrgoryData: any = {};
  showClick = false;
  message;
  responseData;
  SubCatData;
  SubCatDataStatus;
  SubCatMessage;
  currentPage = 1;
  maxSize = 5;
  deleteId;
  constructor(
    private formBuilder: FormBuilder,
    public formService: FormService,
    private api: ApiService,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _toastrSvc: ToastrService) {
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
      let data = await this.api.get(`/admin/subcategories?pagination=1&page=${this.currentPage}`);
      if (data.status == true) {
        this.subcategoryConfig = data.data;
      }
      this._ngxSpinnerSvc.hide();
    }
    catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error);
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
      this._toastrSvc.success('Error', error);
    }
  }

  // setId() {
  //   this.form.controls['id'].setValue(this.form.controls['category_id'].value);
  // }

  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      const datas = await this.api.post('/admin/change_status', { status: status, id: id, type: 'Subcategory' });
      this._toastrSvc.success('Success', datas.message);
      this.SubCategory()
    } catch (error) {
      this._toastrSvc.error('Error', error);
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

      if (data.status) {
        $('.close').click()
        this._toastrSvc.success('Success', data.message);
        this.SubCategory()
      } else {
        this._toastrSvc.error('Error', data.message);
        this._ngxSpinnerSvc.hide();
      }
    }
    catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error);
    }
  }

  async updateSubCatForm() {
    this._ngxSpinnerSvc.show();
    try {
      delete (this.subCatrgoryData.category_name);
      let data = await this.api.post('/admin/update_subcategory', this.subCatrgoryData);
      this.responseData = data.response;
      if (data.status === true) {
        $('.close').click()
        this._toastrSvc.success('Success', data.message);
        this.SubCategory()
      } else {
        this._ngxSpinnerSvc.hide();
        this._toastrSvc.error('Error', data.message);
      }
    } catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error);
    }
  }

  pageChanged(e) {
    this._ngxSpinnerSvc.show();
    this.currentPage = e.page;
    this.SubCategory();
  }
  async deleteSubmit() {
    this._ngxSpinnerSvc.show();
    try {
      let url = `/admin/delete_subcategory?id=${this.deleteId}`;
      let data = await this.api.get(url)

      if (data && data.status) {
        this.form.reset();
        $('.close').click();
        this._toastrSvc.success('Success', data.message);
        this.SubCategory()
      } else {
        this._toastrSvc.error('Error', data.message);
        this.SubCategory()
      }
    } catch (error) {
      this._toastrSvc.error('Error', error);
      this.SubCategory()
    }
  }

  deleteAction(id) {
    this.deleteId = id;
  }

}
