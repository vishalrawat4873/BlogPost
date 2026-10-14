import { Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryServices } from '../services/category-services';
import { UpdateCategoryRequest } from '../Model/category.model';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (typeof value === 'string' && value.length > 0 && value.trim().length === 0) {
    return { whitespace: true };
  }
  return null;
}

@Component({
  selector: 'app-edit-category',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryServices);
  private snackBar = inject(MatSnackBar);

  categoryId = signal<string>('');
  categoryResource = this.categoryService.getCategoryById(() => this.categoryId());

  isLoading = this.categoryResource.isLoading;
  isError = this.categoryResource.error;
  category = this.categoryResource.value;

  isSubmitting = false;

  editCategoryFormGroup = new FormGroup({
    id: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100), noWhitespaceValidator],
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200), noWhitespaceValidator],
    }),
  });

  constructor() {
    // Read route param 'id'
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.categoryId.set(idParam);
    }

    // Populate form once resource loads
    effect(() => {
      const cat = this.category();
      if (cat) {
        this.editCategoryFormGroup.patchValue({
          id: cat.id,
          name: cat.name,
          urlHandle: cat.urlHandle,
        });
      }
    });

    // Handle update status
    effect(() => {
      const status = this.categoryService.updateCategoryStatus();
      if (status === 'success') {
        this.isSubmitting = false;
        this.snackBar.open('Category updated successfully!', 'Close', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
        this.categoryService.updateCategoryStatus.set('idel');
        this.router.navigate(['/admin/categories']);
      } else if (status === 'error') {
        this.isSubmitting = false;
        this.snackBar.open('Failed to update category. Please check details and try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
        this.categoryService.updateCategoryStatus.set('idel');
      }
    });
  }

  get nameFormControl() {
    return this.editCategoryFormGroup.controls.name;
  }

  get urlFormControl() {
    return this.editCategoryFormGroup.controls.urlHandle;
  }

  onSubmit() {
    if (this.editCategoryFormGroup.invalid) {
      this.editCategoryFormGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.editCategoryFormGroup.getRawValue();

    const updateDto: UpdateCategoryRequest = {
      name: formValue.name,
      urlHandle: formValue.urlHandle,
    };

    this.categoryService.updateCategory(this.categoryId(), updateDto);
  }
}

