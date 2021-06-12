import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { FormService } from '../../service/form/form.service';
import { CookieService } from "ngx-cookie-service";
import $ from "jquery";

@Component({
  selector: 'app-serviceman',
  templateUrl: './serviceman.component.html',
  styleUrls: ['./serviceman.component.css']
})
export class ServicemanComponent implements OnInit {
  subcategory;
  generalcategory;
  public form: FormGroup;
  public submitted = false;
  subcategorys;
  subCatrgoryData: any = {};
  message;
  responseData;
  SubCatData;
  SubCatDataStatus;
  SubCatDataError;
  showClick = false;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, private router: Router, public formService: FormService, private api: ApiService) {
  }
  servicemanList;
  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      id: [''],
    });
    this.Servicemans();
  }
  async Servicemans() {
    // try {
      let data = await this.api.get('/serviceman/list');
      if (data.status == true) {
        this.servicemanList = data.data.data;
      } else {
      }
    // }
    // catch (error) {}
  }
  async changeStatus(status, id) {
    try {
      let datas = await this.api.post('/serviceman/change_status', {'status': status, 'id': id});
      this.Servicemans();
    }
    catch (error) {
    }

  }

  EditForm(AllData) {
    this.showClick = true;
    this.subcategory = AllData;
    console.log("dataa", this.subcategory);
    // this.subCatrgoryData.categories_id = this.subcategory.categories_id;
    this.subCatrgoryData.name = this.subcategory.name;
    this.subCatrgoryData.desc = this.subcategory.desc;
    this.subCatrgoryData.id = this.subcategory.id;
    // this.form.setValue(this.subcategory);
  }

async addsubCatForm() {
  // this.submitted = true;

  // if (this.form.value.name !== ''  this.form.value.desc !== ''  || this.form.value.category_id !== '' ) {}
  try {
        let data = await this.api.post('/admin/add_subcategory', this.form.value);
        this.SubCatData = data.data;
        this.SubCatDataStatus = data.status;
        this.SubCatDataError = data.message;

        if (this.SubCatData == true) {
        $('.close').click();
        alert(this.SubCatDataError);
        this.Servicemans();
      } else{
        alert(this.SubCatDataError);
      }
    }
    catch { }
}


async updateSubCatForm() {
  console.log('this.subCatrgoryData', this.subCatrgoryData);
  try {
      let data = await this.api.post('/admin/update_subcategory', this.subCatrgoryData);
      this.message = data.message;
      this.responseData = data.response;
      if (data.status === true) {
        $('.close').click();
        alert(this.message);
        this.Servicemans();
      } else{
        alert(this.message);
      }
    } catch (error) {
    }
  }
}
