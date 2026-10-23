import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-selector',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
  private dialogRef = inject(MatDialogRef<ImageSelector, string>);

  // call this when an image is clicked in the list
  select(imageUrl: string) {
    this.dialogRef.close(imageUrl);
  }
}