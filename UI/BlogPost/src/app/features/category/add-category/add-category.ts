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

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-category',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})


export class AddCategory {

  private categoryService = inject(CategoryServices);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;

  constructor() {
    effect(() => {
      const status = this.categoryService.addCategoryStatus();
      if (status === 'success') {
        this.isSubmitting = false;
        this.snackBar.open('Category created successfully!', 'Close', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
        this.categoryService.addCategoryStatus.set('idel');
        this.router.navigate(['/admin/categories']);
      }
      if (status === 'error') {
        this.isSubmitting = false;
        this.snackBar.open('Failed to create category. Please check details and try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
        this.categoryService.addCategoryStatus.set('idel');
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
    if (this.addCategoryFormGroup.invalid) {
      this.addCategoryFormGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const addCategoryFormValue = this.addCategoryFormGroup.getRawValue();

    const addCategoryRequestDto: AddCategoryRequest = {
      name: addCategoryFormValue.name,
      urlHandle: addCategoryFormValue.urlHandel
    }
    this.categoryService.addCategory(addCategoryRequestDto);
  }
}
