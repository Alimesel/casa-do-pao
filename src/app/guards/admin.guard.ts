import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('cdp_admin') === 'true') return true;
  router.navigate(['/admin-login']);
  return false;
};