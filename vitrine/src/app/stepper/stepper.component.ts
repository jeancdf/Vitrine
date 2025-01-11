import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  @Input() currentPageIndex: number = 0;

  pages = [
    { name: 'Home', path: '/' },
    { name: 'Top Tracks', path: '/top-tracks-popularity' },
    { name: 'Yearly Trends', path: '/yearly-trends' },
    { name: 'Track Characteristics', path: '/track-characteristics' },
    { name: 'Device Usage', path: '/spotify-usage-insights' },
    { name: 'Favorite Genres', path: '/favorite-genres' },
  ];

  constructor(private router: Router) {}

  navigateToPage(index: number): void {
    const selectedPage = this.pages[index];
    if (selectedPage) {
      this.router.navigate([selectedPage.path]);
    }
  }
}
