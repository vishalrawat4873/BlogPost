import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { BlogDetails } from './features/public/blog-details/blog-details';
import { CategoryList } from './features/category/category-list/category-list';
import { AddCategory } from './features/category/add-category/add-category';
import { EditCategory } from './features/category/edit-category/edit-category';
import { BlogList } from './features/blog-post/blog-list/blog-list';
import { AddBlog } from './features/blog-post/add-blog/add-blog';
import { EditBlog } from './features/blog-post/edit-blog/edit-blog';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'blog/:url',
    component: BlogDetails,
  },
  {
    path: 'admin/categories',
    component: CategoryList,
  },
  {
    path: 'admin/categories/add-category',
    component: AddCategory,
  },
  {
    path: 'admin/categories/:id/edit',
    component: EditCategory,
  },
  {
    path: 'admin/blogs',
    component: BlogList,
  },
  {
    path: 'admin/blogs/add-blog',
    component: AddBlog,
  },
  {
    path: 'admin/blogs/:id/edit',
    component: EditBlog,
  },
];
