import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AddCategoryRequest, Category } from '../Model/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private http = inject(HttpClient);
  private apiBaseUrl = 'https://localhost:7083';

  addCategoryStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');
  deleteCategoryStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');
 
  getAllCategory(){
    return httpResource<Category[]>(()=> `${this.apiBaseUrl}/api/Category`)
  }

  
  addCategory(category: AddCategoryRequest){
    this.addCategoryStatus.set('loading');
  this.http.post<void>(`${this.apiBaseUrl}/api/Category`,category).subscribe({
    next: () => {
      this.addCategoryStatus.set('success');
    },
    error: () => {this.addCategoryStatus.set('error')}
  })
  }

  deleteCategory(category: Category){
    this.deleteCategoryStatus.set('loading');
    this.http.delete<void>(`${this.apiBaseUrl}/api/Category/${category.id}`).subscribe({
      next: () =>{
        this.deleteCategoryStatus.set('success');
      },
      error: () => {
        this.deleteCategoryStatus.set('error');
      }
    })
  }

  
}
