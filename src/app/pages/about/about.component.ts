import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  values = [
    {
      icon: '🌾',
      title: 'Local Sourcing',
      desc: 'We partner with Portuguese farms and producers for seasonal, fresh ingredients.'
    },
    {
      icon: '🧑‍🍳',
      title: 'Artisan Craft',
      desc: 'Every item is handmade by our team of trained pastry chefs using traditional methods.'
    },
    {
      icon: '☕',
      title: 'Single Origin Coffee',
      desc: 'Our beans are ethically sourced from single-origin farms in Brazil and Ethiopia.'
    },
    {
      icon: '♻️',
      title: 'Zero Waste',
      desc: 'We compost, reduce packaging, and donate unsold items to local charities daily.'
    }
  ];

  team = [
    {
      name: 'Ana Ferreira',
      role: 'Head Pastry Chef',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80',
      bio: '15 years of patisserie experience across Paris and Lisboa.'
    },
    {
      name: 'Tomás Silva',
      role: 'Head Barista',
      image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80',
      bio: 'World Coffee Champion finalist, passionate about the perfect pour.'
    },
    {
      name: 'Maria Santos',
      role: 'Cake Artist',
      image: 'https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=400&q=80',
      bio: 'Creates bespoke celebration cakes for weddings and events.'
    }
  ];

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => this.observer!.observe(el));
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
