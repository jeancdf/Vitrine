import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('navbarTransition', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(-100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden <=> visible', [
        animate('0.8s ease-out')
      ])
    ])
  ]
})
export class NavbarComponent {
  menuState = 'hidden'; // Initial state

  toggleMenu() {
    this.menuState = this.menuState === 'hidden' ? 'visible' : 'hidden';
    console.log('Menu state:', this.menuState);
  }
}
