import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Casa do Pão — Artisan Sweet Shop'
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.component').then(m => m.CategoriesComponent),
    title: 'Categories — Casa do Pão'
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(m => m.ProductsComponent),
    title: 'Our Menu — Casa do Pão'
  },
  {
    path: 'products/:category',
    loadComponent: () =>
      import('./pages/products/products.component').then(m => m.ProductsComponent),
    title: 'Menu — Casa do Pão'
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About Us — Casa do Pão'
  },
  {
    path: 'visit',
    loadComponent: () =>
      import('./pages/visit-us/visit-us.component').then(m => m.VisitUsComponent),
    title: 'Visit Us — Casa do Pão'
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Login — Casa do Pão'
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [adminGuard],
    title: 'Admin Panel — Casa do Pão'
  },
  {
    path: '**',
    redirectTo: ''
  }
];