import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryServices } from '../services/category-services';
import { Category } from '../Model/category.model';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-category-list',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {

  private categoryService = inject(CategoryServices);
  private snackBar = inject(MatSnackBar);
  getAllCategoriesRef = this.categoryService.getAllCategory();

  isLoading = this.getAllCategoriesRef.isLoading;
  isError = this.getAllCategoriesRef.error;
  value = this.getAllCategoriesRef.value;

  categoryToDelete: Category | null = null;

  constructor() {
    effect(() => {
      const status = this.categoryService.deleteCategoryStatus();
      if (status === 'success') {
        this.snackBar.open('Category deleted successfully!', 'Close', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
        this.getAllCategoriesRef.reload();
        this.categoryService.deleteCategoryStatus.set('idel');
      } else if (status === 'error') {
        this.snackBar.open('Failed to delete category. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
        this.categoryService.deleteCategoryStatus.set('idel');
      }
    });
  }

  confirmDelete(category: Category) {
    this.categoryToDelete = category;
  }

  cancelDelete() {
    this.categoryToDelete = null;
  }

  proceedDelete() {
    if (!this.categoryToDelete) return;
    const category = this.categoryToDelete;
    this.categoryToDelete = null;
    this.categoryService.deleteCategory(category);
  }
}