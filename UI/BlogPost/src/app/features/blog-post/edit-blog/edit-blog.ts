import { Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { UpdateBlogRequest } from '../models/blog.model';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (typeof value === 'string' && value.length > 0 && value.trim().length === 0) {
    return { whitespace: true };
  }
  return null;
}

@Component({
  selector: 'app-edit-blog',
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
  templateUrl: './edit-blog.html',
  styleUrl: './edit-blog.css',
})
export class EditBlog {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private snackBar = inject(MatSnackBar);
  
  imageSelectorSerivce = inject(ImageSelectorService)
  blogId = signal<string>('');
  blogResource = this.blogService.getBlogById(() => this.blogId());

  isLoading = this.blogResource.isLoading;
  isError = this.blogResource.error;
  blog = this.blogResource.value;

  isSubmitting = false;

  editBlogFormGroup = new FormGroup({
    id: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
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
    publishedDate: new FormControl<string>('', {
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.blogId.set(idParam);
    }

    effect(() => {
      const b = this.blog();
      if (b) {
        const formattedDate = b.publishedDate
          ? new Date(b.publishedDate).toISOString().substring(0, 10)
          : '';
        this.editBlogFormGroup.patchValue({
          id: b.id,
          name: b.name,
          title: b.title,
          shortDescription: b.shortDescription,
          content: b.content,
          featuredImageUrl: b.featuredImageUrl,
          publishedDate: formattedDate,
          author: b.author,
          isVisible: b.isVisible,
        });
      }
    });

    effect(() => {
      const status = this.blogService.updateBlogStatus();
      if (status === 'success') {
        this.isSubmitting = false;
        this.snackBar.open('Blog post updated successfully!', 'Close', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
        this.blogService.updateBlogStatus.set('idel');
        this.router.navigate(['/admin', 'blogs']);
      } else if (status === 'error') {
        this.isSubmitting = false;
        this.snackBar.open('Failed to update blog post. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
        this.blogService.updateBlogStatus.set('idel');
      }
    });
  }

  get nameControl() {
    return this.editBlogFormGroup.controls.name;
  }
  get titleControl() {
    return this.editBlogFormGroup.controls.title;
  }
  get shortDescriptionControl() {
    return this.editBlogFormGroup.controls.shortDescription;
  }
  get contentControl() {
    return this.editBlogFormGroup.controls.content;
  }
  get featuredImageUrlControl() {
    return this.editBlogFormGroup.controls.featuredImageUrl;
  }
  get publishedDateControl() {
    return this.editBlogFormGroup.controls.publishedDate;
  }
  get authorControl() {
    return this.editBlogFormGroup.controls.author;
  }

  onSubmit() {
    if (this.editBlogFormGroup.invalid) {
      this.editBlogFormGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.editBlogFormGroup.getRawValue();

    const requestDto: UpdateBlogRequest = {
      name: formValue.name,
      title: formValue.title,
      shortDescription: formValue.shortDescription,
      content: formValue.content,
      featuredImageUrl: formValue.featuredImageUrl,
      publishedDate: formValue.publishedDate,
      author: formValue.author,
      isVisible: formValue.isVisible,
    };

    this.blogService.updateBlog(this.blogId(), requestDto);
  }
   
  openImageSelector() {
    this.imageSelectorSerivce.open().subscribe((imageUrl) => {
      if (imageUrl) {
        this.editBlogFormGroup.patchValue({ featuredImageUrl: imageUrl });
      }
    });
  }
}

