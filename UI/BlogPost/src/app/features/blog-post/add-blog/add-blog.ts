import { Component, ElementRef, ViewChild, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';

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
    MatTooltipModule,
    MarkdownComponent,
  ],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.css',
})
export class AddBlog {
  private blogService = inject(BlogService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;
  activeTab: 'split' | 'write' | 'preview' = 'split';
  isExpanded = false;

  @ViewChild('contentTextarea') contentTextarea?: ElementRef<HTMLTextAreaElement>;

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

  contentSignal = toSignal(this.addBlogFormGroup.controls.content.valueChanges, {
    initialValue: this.addBlogFormGroup.controls.content.value ?? '',
  });

  wordCount = computed(() => {
    const text = this.contentSignal()?.trim() || '';
    if (!text) return 0;
    return text.split(/\s+/).filter((w) => w.length > 0).length;
  });

  charCount = computed(() => this.contentSignal()?.length || 0);

  readingTime = computed(() => {
    const words = this.wordCount();
    return Math.max(1, Math.ceil(words / 200));
  });

  setActiveTab(tab: 'split' | 'write' | 'preview') {
    this.activeTab = tab;
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  insertMarkdown(prefix: string, suffix = '', defaultText = '') {
    const textarea = this.contentTextarea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || defaultText;

    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    this.contentControl.setValue(newContent);
    this.contentControl.markAsDirty();

    setTimeout(() => {
      textarea.focus();
      const newCursorStart = start + prefix.length;
      const newCursorEnd = newCursorStart + selected.length;
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  }

  insertCodeBlock() {
    this.insertMarkdown('```typescript\n', '\n```', '// Your code here');
  }

  insertTable() {
    const tableTemplate = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Item 1 | Details | $10.00 |\n| Item 2 | Details | $20.00 |\n`;
    this.insertMarkdown(tableTemplate, '', '');
  }

  copyMarkdown() {
    const text = this.contentControl.value;
    if (!text || text.trim().length === 0) {
      this.snackBar.open('Content is empty, nothing to copy', 'Close', { duration: 2500 });
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Markdown copied to clipboard!', 'Close', {
        duration: 2500,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }).catch(() => {
      this.snackBar.open('Unable to copy to clipboard', 'Close', { duration: 2500 });
    });
  }

  handleTextareaKeydown(event: KeyboardEvent) {
    const textarea = this.contentTextarea?.nativeElement;
    if (!textarea) return;

    if (event.key === 'Tab') {
      event.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      textarea.value = val.substring(0, start) + '  ' + val.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      this.contentControl.setValue(textarea.value);
      this.contentControl.markAsDirty();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      this.insertMarkdown('**', '**', 'bold text');
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      this.insertMarkdown('*', '*', 'italic text');
      return;
    }
  }

  loadSampleMarkdown() {
    const sample = `# Exploring Modern Web Architecture in 2026

Building scalable, performant web applications requires thoughtful design, modular components, and solid patterns. In this article, we break down key concepts and modern practices.

## 🚀 Key Takeaways

- **Signals & Zoneless**: Angular's latest reactivity paradigm delivers granular, lightning-fast change detection.
- **Micro-frontends**: Decoupling complex enterprise monoliths into manageable domains.
- **Accessible UI**: Crafting accessible user interfaces with Material 3 design tokens.

> "Simplicity is prerequisite for reliability."  
> — *Edsger W. Dijkstra*

---

### Code Demonstration

Here is an example demonstrating a clean reactive service with Signals:

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();

  increment(): void {
    this._count.update(c => c + 1);
  }
}
\`\`\`

### Comparison Summary

| Approach | Performance | Complexity | Recommended For |
| :--- | :---: | :---: | :--- |
| **Zoneless Signals** | ⚡ High | Low | Modern Angular apps |
| **Zone.js Classic** | Normal | Medium | Legacy codebases |
| **Manual CDR** | High | High | Special edge cases |

---

Feel free to edit this content or replace it with your own blog post!
`;
    this.contentControl.setValue(sample);
    this.contentControl.markAsDirty();
  }

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

