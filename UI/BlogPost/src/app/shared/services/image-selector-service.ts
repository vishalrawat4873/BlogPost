import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ImageSelector } from '../Component/image-selector/image-selector';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
  private dialog = inject(MatDialog);

  // Opens the dialog and emits the selected image URL (undefined if closed without selecting)
  open(): Observable<string | undefined> {
    return this.dialog
      .open<ImageSelector, void, string>(ImageSelector, {
        width: '1100px',
        maxWidth: '95vw',
        maxHeight: '90vh',
      })
      .afterClosed();
  }
}