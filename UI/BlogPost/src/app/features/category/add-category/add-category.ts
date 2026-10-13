import { Component, effect, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AddCategoryRequest } from '../Model/category.model';
import { CategoryServices } from '../services/category-services';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (typeof value === 'string' && value.length > 0 && value.trim().length === 0) {
    return { whitespace: true };
  }
  return null;
}

@Component({
  selector: 'app-add-category',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})


export class AddCategory {

  private categoryService = inject(CategoryServices);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.categoryService.addCategoryStatus() === 'success') {
        this.categoryService.addCategoryStatus.set('idel');
        this.router.navigate(['/admin/categories']);
      }
      if (this.categoryService.addCategoryStatus() === 'error') {
        console.log('Add category request failed');
      }
    });
  }
  //import reactive form moduls
  //import formgroup--> form control
  addCategoryFormGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100), noWhitespaceValidator]
    }),
    urlHandel: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200), noWhitespaceValidator]
    })
  });

  get nameFormControl() {
    return this.addCategoryFormGroup.controls.name;
  }
  get urlFormControl() {
    return this.addCategoryFormGroup.controls.urlHandel;
  }

  onSubmit() {
    const addCategoryFormValue = this.addCategoryFormGroup.getRawValue();

    const addCategoryRequestDto: AddCategoryRequest = {
      name: addCategoryFormValue.name,
      urlHandle: addCategoryFormValue.urlHandel
    }
    this.categoryService.addCategory(addCategoryRequestDto);
  }
}
