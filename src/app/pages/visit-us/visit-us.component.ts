import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

const SLIDE_DURATION_MS = 4500; // time each slide stays visible
const TICK_MS           = 50;   // progress-bar update interval

@Component({
  selector: 'app-visit-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-us.component.html',
  styleUrls: ['./visit-us.component.scss']
})
export class VisitUsComponent implements OnInit, OnDestroy {

  /* ── Data ── */
  hours = [
    { day: 'Segunda-feira',    time: '07:00 – 23:00' },
    { day: 'Terça-feira',   time: '07:00 – 23:00' },
    { day: 'Quarta-feira', time: '07:00 – 23:00' },
    { day: 'Quinta-feira',  time: '07:00 – 23:00' },
    { day: 'Sexta-feira',    time: '07:00 – 23:00' },
    { day: 'Sábado',  time: '07:00 – 23:00' },
    { day: 'Domingo',    time: '07:00 – 21:00' },
  ];

  images = [
    { src: 'assets/images/visit1.jpeg', label: 'Interior'     },
    { src: 'assets/images/visit2.jpeg', label: 'Tables'   },
    { src: 'assets/images/visit3.jpeg', label: 'Coffee'       },
    { src: 'assets/images/visit4.jpeg', label: 'Beauty' },
  ];

  /* ── Carousel state ── */
  carouselIndex = 0;
  progressPct   = 0;          // 0–100, drives the progress bar width

  private autoTimer?: ReturnType<typeof setInterval>;
  private tickTimer?: ReturnType<typeof setInterval>;
  private elapsed  = 0;       // ms elapsed in current slide
  private paused   = false;

  /* ── Lightbox state ── */
  lightboxOpen  = false;
  lightboxIndex = 0;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  /* ── Lifecycle ── */
  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
    document.body.style.overflow = '';
  }

  /* ── Today highlight ── */
  get todayIndex(): number {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  }

  /* ── Carousel controls ── */
  goToSlide(index: number): void {
    this.carouselIndex = index;
    this.resetProgress();
  }

  pauseCarousel(): void {
    this.paused = true;
  }

  resumeCarousel(): void {
    this.paused = false;
  }

  private startCarousel(): void {
    // Run timers outside Angular zone to avoid triggering change detection
    // on every tick — we call detectChanges() manually only when needed.
    this.ngZone.runOutsideAngular(() => {
      this.tickTimer = setInterval(() => {
        if (this.paused || this.lightboxOpen) return;

        this.elapsed += TICK_MS;
        this.progressPct = Math.min((this.elapsed / SLIDE_DURATION_MS) * 100, 100);

        if (this.elapsed >= SLIDE_DURATION_MS) {
          this.elapsed = 0;
          this.progressPct = 0;
          // Advance slide inside Angular zone so bindings update
          this.ngZone.run(() => {
            this.carouselIndex = (this.carouselIndex + 1) % this.images.length;
          });
        }

        // Update the progress bar binding
        this.cdr.detectChanges();
      }, TICK_MS);
    });
  }

  private stopCarousel(): void {
    if (this.tickTimer)  clearInterval(this.tickTimer);
    if (this.autoTimer)  clearInterval(this.autoTimer);
  }

  private resetProgress(): void {
    this.elapsed     = 0;
    this.progressPct = 0;
  }

  /* ── Lightbox ── */
  openLightbox(index: number): void {
    this.lightboxIndex = index;
    this.lightboxOpen  = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
    this.resetProgress();
  }

  nextImage(e: Event): void {
    e.stopPropagation();
    this.lightboxIndex = (this.lightboxIndex + 1) % this.images.length;
  }

  prevImage(e: Event): void {
    e.stopPropagation();
    this.lightboxIndex = (this.lightboxIndex - 1 + this.images.length) % this.images.length;
  }

  /* ── Keyboard ── */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (this.lightboxOpen) {
      if (e.key === 'Escape')      this.closeLightbox();
      if (e.key === 'ArrowRight')  this.nextImage(e);
      if (e.key === 'ArrowLeft')   this.prevImage(e);
    } else {
      if (e.key === 'ArrowRight') {
        this.carouselIndex = (this.carouselIndex + 1) % this.images.length;
        this.resetProgress();
      }
      if (e.key === 'ArrowLeft') {
        this.carouselIndex = (this.carouselIndex - 1 + this.images.length) % this.images.length;
        this.resetProgress();
      }
    }
  }
}