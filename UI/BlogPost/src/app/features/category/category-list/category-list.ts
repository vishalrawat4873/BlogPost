import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Navbar } from '../../../core/components/navbar/navbar';

@Component({
  selector: 'app-category-list',
  imports: [RouterOutlet, Navbar, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {

}
