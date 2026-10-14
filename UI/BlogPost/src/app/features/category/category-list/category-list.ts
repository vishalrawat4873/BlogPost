import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Navbar } from '../../../core/components/navbar/navbar';
import { CategoryServices } from '../services/category-services';
import { Category } from '../Model/category.model';

@Component({
  selector: 'app-category-list',
  imports: [RouterOutlet, Navbar, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {

  private categoryService = inject(CategoryServices);
  getAllCategoriesRef = this.categoryService.getAllCategory();

  isLoading = this.getAllCategoriesRef.isLoading;
  isError = this.getAllCategoriesRef.error;
  value = this.getAllCategoriesRef.value;

  // Modern Toast notification state
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' = 'success';

  // Delete confirmation modal state
  categoryToDelete: Category | null = null;

  constructor() {
    effect(() => {
      const status = this.categoryService.deleteCategoryStatus();
      if (status === 'success') {
        this.showToast('Category deleted successfully!', 'success');
        this.getAllCategoriesRef.reload();
        this.categoryService.deleteCategoryStatus.set('idel');
      } else if (status === 'error') {
        this.showToast('Failed to delete category. Please try again.', 'danger');
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

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === message) {
        this.toastMessage = null;
      }
    }, 3500);
  }
}