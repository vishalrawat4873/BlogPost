import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AddCategoryRequest } from '../Model/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private http = inject(HttpClient);
  private apiBaseUrl = 'https://localhost:7241';

  addCategoryStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');

  addCategory(category: AddCategoryRequest){
    this.addCategoryStatus.set('loading');
  this.http.post<void>(`${this.apiBaseUrl}/api/Categories`,category).subscribe({
    next: () => {
      this.addCategoryStatus.set('success');
    },
    error: () => {this.addCategoryStatus.set('error')}
  })
  }
}
