import { Component, inject, OnInit } from '@angular/core';
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
      <app-navbar />
      <router-outlet />
      <app-footer />
      <app-cart-sidebar />
    }
  `
})
export class AppComponent implements OnInit {
  dataService  = inject(DataService);
  private router = inject(Router);

  isAdminRoute = false;

  constructor() {
    // ── Scroll to top on every route change ──────────────────
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isAdminRoute = (e.url as string).startsWith('/admin');
        // Always scroll window to top when navigating
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
  }

  ngOnInit() {
    // ── Hide splash as soon as data has loaded ────────────────
    // DataService starts loading in its constructor.
    // We poll the loading signal; once it's false AND categories exist, hide.
    const checkReady = () => {
      if (!this.dataService.loading() && this.dataService.categories.length > 0) {
        // Small paint-frame delay so Angular finishes rendering first
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (typeof window.hideSplash === 'function') {
              window.hideSplash();
            }
          });
        });
      } else if (this.dataService.error()) {
        // If there is an error, hide splash anyway so error message shows
        if (typeof window.hideSplash === 'function') {
          window.hideSplash();
        }
      } else {
        // Keep checking every 80ms
        setTimeout(checkReady, 80);
      }
    };
    // Start checking after a tiny delay to let Angular bootstrap fully
    setTimeout(checkReady, 100);
  }
}