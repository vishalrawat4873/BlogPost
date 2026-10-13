import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Navbar } from '../../../core/components/navbar/navbar';
import { CategoryServices } from '../services/category-services';

@Component({
  selector: 'app-category-list',
  imports: [RouterOutlet, Navbar, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private categoryService = inject(CategoryServices);
  getAllCategoriesRef = this.categoryService.getAllCategory();

  isLoading = this.getAllCategoriesRef.isLoading;
  isError = this.getAllCategoriesRef.error;
  value = this.getAllCategoriesRef.value;
}
