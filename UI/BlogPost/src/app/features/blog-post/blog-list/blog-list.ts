import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { Blog } from '../models/blog.model';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-blog-list',
  imports: [
    RouterLink,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export class BlogList {
  private blogService = inject(BlogService);
  private snackBar = inject(MatSnackBar);

  getAllBlogsRef = this.blogService.getAllBlogs();

  isLoading = this.getAllBlogsRef.isLoading;
  isError = this.getAllBlogsRef.error;
  value = this.getAllBlogsRef.value;

  blogToDelete: Blog | null = null;

  constructor() {
    effect(() => {
      const status = this.blogService.deleteBlogStatus();
      if (status === 'success') {
        this.snackBar.open('Blog post deleted successfully!', 'Close', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
        this.getAllBlogsRef.reload();
        this.blogService.deleteBlogStatus.set('idel');
      } else if (status === 'error') {
        this.snackBar.open('Failed to delete blog post. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
        this.blogService.deleteBlogStatus.set('idel');
      }
    });
  }

  confirmDelete(blog: Blog) {
    this.blogToDelete = blog;
  }

  cancelDelete() {
    this.blogToDelete = null;
  }

  proceedDelete() {
    if (!this.blogToDelete) return;
    const id = this.blogToDelete.id;
    this.blogToDelete = null;
    this.blogService.deleteBlog(id);
  }
}

