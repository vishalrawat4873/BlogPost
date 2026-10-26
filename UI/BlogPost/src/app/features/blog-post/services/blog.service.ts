import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Blog, CreateBlogRequest, UpdateBlogRequest } from '../models/blog.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  addBlogStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');
  updateBlogStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');
  deleteBlogStatus = signal<'idel' | 'loading' | 'error' | 'success'>('idel');

  getAllBlogs() {
    return httpResource<Blog[]>(() => `${this.apiBaseUrl}/api/Blog`);
  }

  getBlogById(id: () => string) {
    return httpResource<Blog>(() => `${this.apiBaseUrl}/api/Blog/${id()}`);
  }

  getBlogByName(name: () => string) {
    return httpResource<Blog>(() => `${this.apiBaseUrl}/api/Blog/${encodeURIComponent(name())}`);
  }

  addBlog(blog: CreateBlogRequest) {
    this.addBlogStatus.set('loading');
    this.http.post<Blog>(`${this.apiBaseUrl}/api/Blog`, blog).subscribe({
      next: () => {
        this.addBlogStatus.set('success');
      },
      error: () => {
        this.addBlogStatus.set('error');
      },
    });
  }

  updateBlog(id: string, blog: UpdateBlogRequest) {
    this.updateBlogStatus.set('loading');
    this.http.put<Blog>(`${this.apiBaseUrl}/api/Blog/${id}`, blog).subscribe({
      next: () => {
        this.updateBlogStatus.set('success');
      },
      error: () => {
        this.updateBlogStatus.set('error');
      },
    });
  }

  deleteBlog(id: string) {
    this.deleteBlogStatus.set('loading');
    this.http.delete<boolean>(`${this.apiBaseUrl}/api/Blog/${id}`).subscribe({
      next: () => {
        this.deleteBlogStatus.set('success');
      },
      error: () => {
        this.deleteBlogStatus.set('error');
      },
    });
  }
}

