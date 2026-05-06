import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';
import { filter } from 'rxjs/operators';

declare const window: any;

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
      @if (pageReady()) {
        <app-navbar />
      }
      <router-outlet />
      @if (pageReady()) {
        <app-footer />
        <app-cart-sidebar />
      }
    }
  `
})
export class AppComponent implements OnInit {
  dataService    = inject(DataService);
  private router = inject(Router);

  isAdminRoute = false;
  pageReady    = signal(false);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isAdminRoute = (e.url as string).startsWith('/admin');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
  }

  ngOnInit() {
    // Home component calls this once its view is painted
    window.notifyPageReady = () => {
      this.pageReady.set(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (typeof window.hideSplash === 'function') window.hideSplash();
      }));
    };

    // Fallback: if notifyPageReady is never called (error state etc.), bail out after 4s
    setTimeout(() => {
      if (!this.pageReady()) {
        this.pageReady.set(true);
        if (typeof window.hideSplash === 'function') window.hideSplash();
      }
    }, 4000);

    // For any route that is NOT home, show the shell immediately
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url = e.url as string;
        if (url !== '/' && url !== '') {
          this.pageReady.set(true);
          if (typeof window.hideSplash === 'function') window.hideSplash();
        }
      });
  }
}