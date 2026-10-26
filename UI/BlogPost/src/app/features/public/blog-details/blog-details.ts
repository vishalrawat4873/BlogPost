import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../../blog-post/services/blog.service';
import { MarkdownComponent } from 'ngx-markdown';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    MarkdownComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  url = signal<string>('');

  blogResource = this.blogService.getBlogByName(() => this.url());
  isLoading = this.blogResource.isLoading;
  isError = this.blogResource.error;
  blog = this.blogResource.value;

  readTime = computed(() => {
    const b = this.blog();
    if (!b || !b.content) return 1;
    const words = b.content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const urlParam = params.get('url');
      if (urlParam) {
        this.url.set(urlParam);
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}

