import { Component,  ElementRef, Renderer2, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

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
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {
    '(window:scroll)': 'onWindowScroll($event)'
  }
})

export class HomeComponent implements AfterViewInit {
  @ViewChild('carousel', { static: true }) carousel!: ElementRef;
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

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    gsap.registerPlugin(Draggable);

    Draggable.create(this.carousel.nativeElement, {
      type: 'x',
      inertia: true,
      bounds: { minX: -200 * this.cards.length, maxX: 0 },
      onDragEnd: () => {
        this.updateActiveIndex();
      }
    });


    console.log('Initializing HomeComponent...');
    this.initSectionObserver();
    this.initParticles();
    console.log('Initialization complete.');
  }

  private initSectionObserver() {
    console.log('Setting up section observer...');
    const sections = this.el.nativeElement.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'in-view');
          console.log('Section in view:', entry.target);
        } else {
          this.renderer.removeClass(entry.target, 'in-view');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach((section: HTMLElement) => observer.observe(section));
  }

  onWindowScroll(event: Event) {
    const parallaxElements = this.el.nativeElement.querySelectorAll('.parallax');
    parallaxElements.forEach((element: HTMLElement) => {
      const speed = parseFloat(element.dataset['speed'] || '0.5');
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
    console.log('Animating text for element:', element, 'with config:', config);
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
    console.log('Initializing particles...');
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setStyle(canvas, 'position', 'fixed');
    this.renderer.setStyle(canvas, 'top', '0');
    this.renderer.setStyle(canvas, 'left', '0');
    this.renderer.setStyle(canvas, 'width', '100%');
    this.renderer.setStyle(canvas, 'height', '100%');
    this.renderer.setStyle(canvas, 'z-index', '-1');
    this.renderer.appendChild(this.el.nativeElement, canvas);
    console.log('Canvas added to DOM');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    console.log('Canvas context obtained');

    const particles: Particle[] = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5
      });
    }
    console.log('Created', particles.length, 'particles');

    const animate = () => {
      if (!ctx) {
        console.error('Context lost during animation');
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    console.log('Starting particle animation loop');
    animate();

    window.addEventListener('resize', () => {
      console.log('Window resized. New dimensions:', window.innerWidth, 'x', window.innerHeight);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  getLeftIndex(): number {
    return (this.activeIndex - 1 + this.cards.length) % this.cards.length;
  }

  getRightIndex(): number {
    return (this.activeIndex + 1) % this.cards.length;
  }

  updateActiveIndex() {
    const draggable = Draggable.get(this.carousel.nativeElement);
    const draggedDistance = draggable.x;

    const cardWidth = 300; // Width of one card including margin
    const indexShift = Math.round(draggedDistance / cardWidth);

    this.activeIndex = (this.activeIndex - indexShift + this.cards.length) % this.cards.length;

    // Animate back to correct position
    gsap.to(this.carousel.nativeElement, { x: -this.activeIndex * cardWidth, duration: 0.5 });
  }
}
