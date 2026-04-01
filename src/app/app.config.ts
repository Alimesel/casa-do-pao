import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // ── KEY FIX: preload ALL lazy routes in the background immediately ──
      // This means when user taps a nav link, the chunk is already downloaded
      withPreloading(PreloadAllModules),
      // Smooth page transitions (Angular 17+)
      withViewTransitions()
    )
  ]
};