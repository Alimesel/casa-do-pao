import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, PreloadAllModules } from '@angular/router';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent, CartSidebarComponent],
  template: `
    @if (isAdminRoute) {
      <router-outlet />
    } @else if (dataService.error()) {
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:red;">
        {{ dataService.error() }}
      </div>
    } @else {
      <!-- Show navbar/footer/shell immediately, even while data loads -->
      <app-navbar />
      <router-outlet />
      <app-footer />
      <app-cart-sidebar />
    }
  `
})
export class AppComponent {
  dataService  = inject(DataService);
  private router = inject(Router);

  isAdminRoute = false;

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isAdminRoute = e.url.startsWith('/admin');
      });
  }
}