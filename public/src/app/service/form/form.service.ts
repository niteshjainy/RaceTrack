import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms'; 
@Injectable()
export class FormService {
   constructor() { }
   validate(formGroup: FormGroup, controlName: string): boolean { 
       return formGroup.controls[controlName].invalid &&
        formGroup.controls[controlName].touched; }
} 