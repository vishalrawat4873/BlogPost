import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../blog-post/services/blog.service';
import { CategoryServices } from '../../category/services/category-services';
import { Blog } from '../../blog-post/models/blog.model';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private blogService = inject(BlogService);
  private categoryServices = inject(CategoryServices);

  blogsResource = this.blogService.getAllBlogs();
  categoriesResource = this.categoryServices.getAllCategory();

  isLoading = this.blogsResource.isLoading;
  isError = this.blogsResource.error;

  searchQuery = signal<string>('');
  selectedCategoryId = signal<string>('all');
  sortBy = signal<'latest' | 'oldest' | 'title'>('latest');
  newsletterEmail = signal<string>('');
  subscribed = signal<boolean>(false);

  allBlogs = computed<Blog[]>(() => {
    const list = this.blogsResource.value() || [];
    // Only show visible blogs to the public
    return list.filter((b) => b.isVisible);
  });

  categories = computed(() => this.categoriesResource.value() || []);

  featuredBlog = computed<Blog | null>(() => {
    const blogs = this.allBlogs();
    return blogs.length > 0 ? blogs[0] : null;
  });

  filteredBlogs = computed<Blog[]>(() => {
    let list = this.allBlogs();
    const query = this.searchQuery().trim().toLowerCase();
    const categoryId = this.selectedCategoryId();
    const sort = this.sortBy();

    // Filter by Category
    if (categoryId !== 'all') {
      list = list.filter((blog) => blog.categoryDtos?.some((c) => c.id === categoryId));
    }

    // Filter by Search Query
    if (query) {
      list = list.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.shortDescription.toLowerCase().includes(query) ||
          blog.author.toLowerCase().includes(query) ||
          blog.name.toLowerCase().includes(query)
      );
    }

    // Sort list
    return [...list].sort((a, b) => {
      if (sort === 'latest') {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      }
      if (sort === 'oldest') {
        return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  });

  selectCategory(categoryId: string): void {
    this.selectedCategoryId.set(categoryId);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategoryId.set('all');
  }

  calculateReadTime(content: string): number {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  getInitials(name: string): string {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  subscribeNewsletter(): void {
    if (!this.newsletterEmail() || !this.newsletterEmail().includes('@')) return;
    this.subscribed.set(true);
  }

  retry(): void {
    this.blogsResource.reload();
    this.categoriesResource.reload();
  }
}

