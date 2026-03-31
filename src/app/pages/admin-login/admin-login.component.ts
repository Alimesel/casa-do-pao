import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = signal('');
  loading = signal(false);

  // Change these to whatever you want
  private readonly ADMIN_USER = 'admin';
  private readonly ADMIN_PASS = 'casadopao2024';

  constructor(private router: Router) {}

  login() {
    this.error.set('');
    this.loading.set(true);

    setTimeout(() => {
      if (this.username === this.ADMIN_USER && this.password === this.ADMIN_PASS) {
        localStorage.setItem('cdp_admin', 'true');
        this.router.navigate(['/admin']);
      } else {
        this.error.set('Invalid username or password.');
      }
      this.loading.set(false);
    }, 600);
  }
}