import { Component, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavbarComponent } from '../navbar/navbar.component';

interface TextRevealConfig {
  text: string;
  delay: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

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

    this.initParticles();
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

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const cards = this.el.nativeElement.querySelectorAll('.project-card');
    cards.forEach((card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = -(x - centerX) / 10;
      
      this.renderer.setStyle(card, 'transform', 
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    });
  }

  animateText(element: HTMLElement, config: TextRevealConfig) {
    const text = config.text.split('');
    element.innerHTML = '';
    
    text.forEach((char, index) => {
      const span = this.renderer.createElement('span');
      this.renderer.setProperty(span, 'textContent', char);
      this.renderer.setStyle(span, 'opacity', '0');
      this.renderer.setStyle(span, 'transform', 'translateY(20px)');
      this.renderer.setStyle(span, 'transition', 'all 0.3s ease');
      this.renderer.setStyle(span, 'transition-delay', `${config.delay + (index * 0.05)}s`);
      
      this.renderer.appendChild(element, span);
      setTimeout(() => {
        this.renderer.setStyle(span, 'opacity', '1');
        this.renderer.setStyle(span, 'transform', 'translateY(0)');
      }, 100);
    });
  }

  private initParticles() {
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setStyle(canvas, 'position', 'fixed');
    this.renderer.setStyle(canvas, 'top', '0');
    this.renderer.setStyle(canvas, 'left', '0');
    this.renderer.setStyle(canvas, 'width', '100%');
    this.renderer.setStyle(canvas, 'height', '100%');
    this.renderer.setStyle(canvas, 'z-index', '1');
    
    this.renderer.appendChild(this.el.nativeElement, canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];

    // Create particles with different colors
    const colors = ['#2c3e50', '#3498db', '#e74c3c', '#2ecc71', '#f1c40f'];
    
    for(let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2, // Slightly larger particles
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2 // Varying opacity
      });
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if(particle.x > canvas.width) particle.x = 0;
        if(particle.x < 0) particle.x = canvas.width;
        if(particle.y > canvas.height) particle.y = 0;
        if(particle.y < 0) particle.y = canvas.height;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
}
