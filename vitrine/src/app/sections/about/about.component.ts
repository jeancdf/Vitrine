import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent extends BaseComponent {

  constructor(private router: Router) {
    super();
  }

  override navigate(direction: 'up' | 'down') {
    if (direction === 'down') {
      this.router.navigate(['/projects']);
    } else {
      this.router.navigate(['/']);
    }
  }

}
