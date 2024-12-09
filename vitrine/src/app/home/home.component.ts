import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  host: {
    '(window:scroll)': 'onWindowScroll($event)'
  }
})

export class HomeComponent implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const sections = this.el.nativeElement.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'in-view');
        } else {
          this.renderer.removeClass(entry.target, 'in-view');
        }
      });
    }, { threshold: 0.3 }); // Trigger animation when 30% of the section is visible

    sections.forEach((section: HTMLElement) => observer.observe(section));

    const parallaxElements = this.el.nativeElement.querySelectorAll('.parallax');
    parallaxElements.forEach((element: HTMLElement) => {
      this.applyParallax(element);
    });
  }

  private applyParallax(element: HTMLElement) {
    const speed = element.dataset['speed'] || '0.5';
    this.renderer.setStyle(element, 'transform', 'translateY(0)');
  }

  onWindowScroll(event: Event) {
    const parallaxElements = this.el.nativeElement.querySelectorAll('.parallax');
    parallaxElements.forEach((element: HTMLElement) => {
      const speed = parseFloat(element.dataset['speed'] || '0.5');
      const rect = element.getBoundingClientRect();
      const scrollPosition = window.pageYOffset;
      const offset = scrollPosition * speed;
      
      this.renderer.setStyle(element, 'transform', `translateY(${offset}px)`);
    });
  }
}
