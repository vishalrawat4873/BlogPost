import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogImage } from '../../models/blog-image.model';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector implements OnInit {
  private dialogRef = inject(MatDialogRef<ImageSelector, string>);
  private imageService = inject(ImageService);

  images = signal<BlogImage[]>([]);
  isLoadingImages = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  fileName = signal<string>('');
  title = signal<string>('');

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.isLoadingImages.set(true);
    this.errorMessage.set(null);
    this.imageService.getAllImages().subscribe({
      next: (images) => {
        this.images.set(images);
        this.isLoadingImages.set(false);
      },
      error: (err) => {
        console.error('Error loading images:', err);
        this.errorMessage.set('Failed to load images from server.');
        this.isLoadingImages.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Allowed image formats
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set('Please select a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage.set('Image size cannot exceed 10MB.');
      return;
    }

    this.selectedFile.set(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-populate fileName and title if blank
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    if (!this.fileName().trim()) {
      this.fileName.set(baseName);
    }
    if (!this.title().trim()) {
      this.title.set(baseName);
    }
  }

  uploadImage(): void {
    const file = this.selectedFile();
    if (!file) {
      this.errorMessage.set('Please select an image file first.');
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const fileNameToUpload = this.fileName().trim() || file.name;
    const titleToUpload = this.title().trim() || fileNameToUpload;

    this.imageService.uploadImage(file, fileNameToUpload, titleToUpload).subscribe({
      next: (uploadedImage) => {
        this.isUploading.set(false);
        this.successMessage.set('Image uploaded successfully!');
        this.resetForm();
        this.loadImages();
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.isUploading.set(false);
        this.errorMessage.set(
          err.error?.file?.[0] || err.error?.message || 'Failed to upload image. Please try again.'
        );
      },
    });
  }

  resetForm(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.fileName.set('');
    this.title.set('');
  }

  select(imageUrl: string): void {
    this.dialogRef.close(imageUrl);
  }
}
