import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent extends BaseComponent {

  constructor(private router: Router) {
    super();
  }

  override navigate(direction: 'up' | 'down') {
    if (direction === 'down') {
      console.log('down');
    } else {
      this.router.navigate(['/projects']);
    }
  }
}
