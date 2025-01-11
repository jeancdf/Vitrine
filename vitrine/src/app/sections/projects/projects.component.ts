import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../base/base.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent extends BaseComponent {
  activeIndex = 0;

  cards = [
    {
      image: 'assets/project1.jpg',
      title: 'Project 1',
      description: 'Description of project 1',
    },
    {
      image: 'assets/project2.jpg',
      title: 'Project 2',
      description: 'Description of project 2',
    },
    {
      image: 'assets/project3.jpg',
      title: 'Project 3',
      description: 'Description of project 3',
    },
    {
      image: 'assets/project4.jpg',
      title: 'Project 4',
      description: 'Description of project 4',
    },
  ];

  constructor(private router: Router) {
    super();
  }

  getLeftIndex(): number {
    return (this.activeIndex - 1 + this.cards.length) % this.cards.length;
  }

  getRightIndex(): number {
    return (this.activeIndex + 1) % this.cards.length;
  }

  override navigate(direction: 'up' | 'down') {
    if (direction === 'down') {
      this.router.navigate(['/contact']);
    } else {
      this.router.navigate(['/about']);
    }
  }
}
