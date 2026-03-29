import {
  Component, OnInit, OnDestroy, inject,
  AfterViewInit, ViewChild, ElementRef, HostListener, signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('catTrack') catTrack!: ElementRef<HTMLElement>;

  dataService = inject(DataService);
  cartService = inject(CartService);

  featuredProducts: Product[] = [];

  /** ID of the last product added — resets after 1.5 s */
  addedId = signal<number | null>(null);

  /** ID of the card whose image was clicked (shows "More [category]" overlay) */
  flippedId = signal<number | null>(null);

  scrollY = 0;
  private observer?: IntersectionObserver;
  private animFrame?: number;

  phrases = ['Handcrafted with Love', 'Fresh Every Morning', 'Made for You'];
  currentPhrase = signal('');
  private phraseIndex = 0;
  private charIndex   = 0;
  private isDeleting  = false;
  private typingTimer?: ReturnType<typeof setTimeout>;

  catIndex = signal(0);
  get catMax() { return this.dataService.categories.length - 1; }

  private trackScrollListener?: () => void;

  ngOnInit() {
    this.featuredProducts = this.dataService.getFeaturedProducts();
    this.typingTimer = setTimeout(() => this.startTyping(), 600);
  }

  ngAfterViewInit() {
    this.setupReveal();
    this.bindTrackScroll();
  }

  @HostListener('window:scroll')
  onScroll() { this.scrollY = window.scrollY; }

  /* ── Category carousel ── */
  catPrev() {
    this.catIndex.update(i => Math.max(0, i - 1));
    this.scrollToIndex(this.catIndex());
  }

  catNext() {
    this.catIndex.update(i => Math.min(this.catMax, i + 1));
    this.scrollToIndex(this.catIndex());
  }

  goToCat(i: number) {
    this.catIndex.set(i);
    this.scrollToIndex(i);
  }

  private scrollToIndex(index: number) {
    const track = this.catTrack?.nativeElement;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>('.cat-card');
    const target = cards[index];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  }

  private bindTrackScroll() {
    const track = this.catTrack?.nativeElement;
    if (!track) return;
    this.trackScrollListener = () => {
      const cards = track.querySelectorAll<HTMLElement>('.cat-card');
      if (!cards.length) return;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      this.catIndex.set(closest);
    };
    track.addEventListener('scroll', this.trackScrollListener, { passive: true });
  }

  /* ── Cart ── */
  addToCart(p: Product) {
    this.cartService.addToCart(p);
    this.addedId.set(p.id);
    setTimeout(() => this.addedId.set(null), 1500);
  }

  /* ── Featured card image flip ── */
  /**
   * Toggle the "More [Category]" overlay on the card image.
   * Clicking the same card again closes it; clicking another card switches.
   */
  toggleFlip(id: number) {
    this.flippedId.update(current => (current === id ? null : id));
  }

  /* ── Typing animation ── */
  private startTyping() {
    const phrase = this.phrases[this.phraseIndex];
    if (this.isDeleting) {
      this.currentPhrase.set(phrase.substring(0, this.charIndex - 1));
      this.charIndex--;
    } else {
      this.currentPhrase.set(phrase.substring(0, this.charIndex + 1));
      this.charIndex++;
    }
    let delay = this.isDeleting ? 55 : 90;
    if (!this.isDeleting && this.charIndex === phrase.length) {
      delay = 2000; this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      delay = 400;
    }
    this.typingTimer = setTimeout(() => this.startTyping(), delay);
  }

  /* ── Scroll-reveal ── */
  private setupReveal() {
    this.observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => this.observer!.observe(el));
  }

  ngOnDestroy() {
    if (this.typingTimer) clearTimeout(this.typingTimer);
    if (this.animFrame)   cancelAnimationFrame(this.animFrame);
    this.observer?.disconnect();
    const track = this.catTrack?.nativeElement;
    if (track && this.trackScrollListener)
      track.removeEventListener('scroll', this.trackScrollListener);
  }
}