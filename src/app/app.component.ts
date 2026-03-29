import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent],
  template: `
    @if (dataService.loading()) {
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#8B5E3C;">
        Loading…
      </div>
    } @else if (dataService.error()) {
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:red;">
        {{ dataService.error() }}
      </div>
    } @else {
      <app-navbar />
      <router-outlet />
      <app-footer />
    }
  `
})
export class AppComponent {
  dataService = inject(DataService);
}