import { Component,  ElementRef, Renderer2, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { StepperComponent } from '../stepper/stepper.component';
import { BaseComponent } from '../base/base.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, StepperComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {
    '(window:scroll)': 'onWindowScroll($event)'
  }
})

export class HomeComponent extends BaseComponent {
  constructor(private router: Router) {
    super();
  }

  override navigate(direction: 'up' | 'down') {
    if (direction === 'down') {
      this.router.navigate(['/about']);
    }
  }
}
