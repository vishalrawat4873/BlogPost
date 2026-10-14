import { Component, effect, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { CreateBlogRequest } from '../models/blog.model';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (typeof value === 'string' && value.length > 0 && value.trim().length === 0) {
    return { whitespace: true };
  }
  return null;
}

@Component({
  selector: 'app-add-blog',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.css',
})
export class AddBlog {
  private blogService = inject(BlogService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;

  addBlogFormGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100), noWhitespaceValidator],
    }),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200), noWhitespaceValidator],
    }),
    shortDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500), noWhitespaceValidator],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, noWhitespaceValidator],
    }),
    featuredImageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    publishedDate: new FormControl<string>(new Date().toISOString().substring(0, 10), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    author: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100), noWhitespaceValidator],
    }),
    isVisible: new FormControl<boolean>(true, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const status = this.blogService.addBlogStatus();
      if (status === 'success') {
        this.isSubmitting = false;
        this.snackBar.open('Blog post created successfully!', 'Close', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
        this.blogService.addBlogStatus.set('idel');
        this.router.navigate(['/admin', 'blogs']);
      } else if (status === 'error') {
        this.isSubmitting = false;
        this.snackBar.open('Failed to create blog post. Please check details and try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
        this.blogService.addBlogStatus.set('idel');
      }
    });
  }

  get nameControl() {
    return this.addBlogFormGroup.controls.name;
  }
  get titleControl() {
    return this.addBlogFormGroup.controls.title;
  }
  get shortDescriptionControl() {
    return this.addBlogFormGroup.controls.shortDescription;
  }
  get contentControl() {
    return this.addBlogFormGroup.controls.content;
  }
  get featuredImageUrlControl() {
    return this.addBlogFormGroup.controls.featuredImageUrl;
  }
  get publishedDateControl() {
    return this.addBlogFormGroup.controls.publishedDate;
  }
  get authorControl() {
    return this.addBlogFormGroup.controls.author;
  }

  onSubmit() {
    if (this.addBlogFormGroup.invalid) {
      this.addBlogFormGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.addBlogFormGroup.getRawValue();

    const requestDto: CreateBlogRequest = {
      name: formValue.name,
      title: formValue.title,
      shortDescription: formValue.shortDescription,
      content: formValue.content,
      featuredImageUrl: formValue.featuredImageUrl,
      publishedDate: formValue.publishedDate,
      author: formValue.author,
      isVisible: formValue.isVisible,
    };

    this.blogService.addBlog(requestDto);
  }
}

