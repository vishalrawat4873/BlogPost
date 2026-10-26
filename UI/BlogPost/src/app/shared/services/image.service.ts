import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { BlogImage } from '../models/blog-image.model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  getAllImages(): Observable<BlogImage[]> {
    return this.http.get<BlogImage[]>(`${this.apiBaseUrl}/api/Images`);
  }

  uploadImage(file: File, fileName: string, title: string): Observable<BlogImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);

    return this.http.post<BlogImage>(`${this.apiBaseUrl}/api/Images`, formData);
  }
}

