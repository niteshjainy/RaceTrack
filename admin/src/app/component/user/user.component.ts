import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import $ from 'jquery';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  paginationConfig = {
    currentPage: 1,
    total: 0,
    perPage: 10,
    maxPages: 7
  }

  config = {
    action: 'add',
    data: [],
    editData: {
      id: null,
      images: {
        images: [],
        deleteImages: []
      }
    },
    isSubmit: false,
    deleteId: null
  }

  form: FormGroup

  constructor(
    private _apiSvc: ApiService,
    private _ngxSpinnerSvc: NgxSpinnerService,
    private _fb: FormBuilder,
    private _toastrSvc: ToastrService
  ) { }

  ngOnInit() {
    this._getUsers();
    this._createForm();
  }


  // Get All Users List
  private async _getUsers() {
    this._ngxSpinnerSvc.show();
    let result = await this._apiSvc.get(`/admin/users?pagination=1&page=${this.paginationConfig.currentPage}`);
    console.log('result===', result);

    if (result.status === true && result.code === 200) {
      this.config.data = result.data.data;
      this.paginationConfig.total = result.data.total;
    }
    this._ngxSpinnerSvc.hide();
  }

  private _createForm() {
    this.form = this._fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(25)]],
      last_name: ['', [Validators.required, Validators.maxLength(25)]],
      email_id: ['', [Validators.required, Validators.maxLength(25)]],
      user_role: ['user', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.matchPassword })
  }


  // password match validation
  matchPassword(control: AbstractControl) {
    let pass = control.get('password').value;
    let cPass = control.get('password_confirmation').value;
    if (pass != cPass) {
      control.get('password_confirmation').setErrors({ cn_password: true });
    } else {
      return null;
    }
  }

  // create and update user
  async createUser() {
    this.config.isSubmit = true;
    let isValid = true;

    if (this.config.action == 'edit') {

      Object.keys(this.form.controls).forEach(item => {
        if (item === 'password' || item === 'password_confirmation') {
          return;
        }
        if (this.form.get(item).invalid) {
          isValid = false;
          return;
        }

        if (!isValid) {
          this._toastrSvc.error('Error', 'Please Fill All Required Input Fields.');
          return;
        }
      })
    } else {
      if (this.form.invalid) {
        this._toastrSvc.error('Error', 'Please Fill All Required Input Fields.');
        return;
      }
    }


    let formValue = this.form.value;
    this._ngxSpinnerSvc.show();
    try {
      let result;
      let url = '/admin/create_user';
      if (this.config.action === 'edit') {
        url = '/admin/update_user';
        formValue['id'] = this.config.editData.id;
        delete formValue.password;
        delete formValue.password_confirmation;
      }
      result = await this._apiSvc.post(url, formValue);
      console.log('result===', result);

      this.form.reset();
      $('.close').click();
      this._getUsers();
      this._toastrSvc.success('Success', result.message);
    } catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error.message);
    }
  }

  addUser() {
    this.form.reset();
    this.config.action = 'add';
  }

  setForm(values) {
    this.config.action = 'edit';
    console.log(values, 'values');

    this.form.patchValue({
      first_name: values.first_name || '',
      last_name: values.last_name || '',
      email_id: values.email_id || '',
      user_role: values.user_role || ''
    });

    this.config.editData.id = values.id;
  }

  async deleteSubmit() {
    this._ngxSpinnerSvc.show();
    try {
      let url = `/admin/delete_user?id=${this.config.deleteId}`;
      let data = await this._apiSvc.get(url)
   
      if (data && data.status) {
        this.form.reset();
        $('.close').click();
        this._toastrSvc.success('Success', data.message);
        this._getUsers();
      } else {
        this._toastrSvc.error('Error', data.message);
        this._getUsers();
      }
    } catch (error) {
      this._toastrSvc.error('Error', error);
      this._getUsers();
    }
  }

  deleteAction(id) {
    this.config.deleteId = id;
  }

  pageChanged(e) {
    this._ngxSpinnerSvc.show();
    this.paginationConfig.currentPage = e.page;
    this._getUsers();
  }

  async changeStatus(status, id) {
    this._ngxSpinnerSvc.show();
    try {
      let datas = await this._apiSvc.post("/admin/change_status", { 'status': status, 'id': id, 'type': 'User' })
      this._toastrSvc.success('Success', datas.message);
      this._getUsers()
    }
    catch (error) {
      this._ngxSpinnerSvc.hide();
      this._toastrSvc.error('Error', error);
    }
  }

}
