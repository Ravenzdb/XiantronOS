import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <div class="container">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    p {
      color: #666;
      font-size: 1.2rem;
      line-height: 1.6;
    }
  `]
})
export class AppComponent {
  title = 'Xiantron';
  description = 'Everyone deserves the power to change what\'s hurting us on a massive scale. This needs to end. And we need you — out there — to make it happen.';
}
