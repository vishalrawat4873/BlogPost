import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AddCategoryRequest, Category, UpdateCategoryRequest } from '../Model/category.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  addCategoryStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');
  deleteCategoryStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');
  updateCategoryStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');

  getAllCategory() {
    return httpResource<Category[]>(() => `${this.apiBaseUrl}/api/Category`);
  }

  getCategoryById(id: () => string) {
    return httpResource<Category>(() => `${this.apiBaseUrl}/api/Category/${id()}`);
  }

  addCategory(category: AddCategoryRequest) {
    this.addCategoryStatus.set('loading');
    this.http.post<void>(`${this.apiBaseUrl}/api/Category`, category).subscribe({
      next: () => {
        this.addCategoryStatus.set('success');
      },
      error: () => {
        this.addCategoryStatus.set('error');
      }
    });
  }

  updateCategory(id: string, category: UpdateCategoryRequest) {
    this.updateCategoryStatus.set('loading');
    this.http.put<Category>(`${this.apiBaseUrl}/api/Category/${id}`, category).subscribe({
      next: () => {
        this.updateCategoryStatus.set('success');
      },
      error: () => {
        this.updateCategoryStatus.set('error');
      }
    });
  }

  deleteCategory(category: Category) {
    this.deleteCategoryStatus.set('loading');
    this.http.delete<void>(`${this.apiBaseUrl}/api/Category/${category.id}`).subscribe({
      next: () => {
        this.deleteCategoryStatus.set('success');
      },
      error: () => {
        this.deleteCategoryStatus.set('error');
      }
    });
  }
}
