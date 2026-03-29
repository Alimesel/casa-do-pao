import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visit-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-us.component.html',
  styleUrls: ['./visit-us.component.scss']
})
export class VisitUsComponent implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  hours = [
    { day: 'Monday',    time: '08:00 – 22:00', open: true  },
    { day: 'Tuesday',   time: '08:00 – 22:00', open: true  },
    { day: 'Wednesday', time: '08:00 – 22:00', open: true  },
    { day: 'Thursday',  time: '08:00 – 22:00', open: true  },
    { day: 'Friday',    time: '08:00 – 23:00', open: true  },
    { day: 'Saturday',  time: '09:00 – 23:00', open: true  },
    { day: 'Sunday',    time: '09:00 – 21:00', open: true  },
  ];

  get todayIndex(): number {
    return new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  }

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
