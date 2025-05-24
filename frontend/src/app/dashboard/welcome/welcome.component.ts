import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome">
      <h1>Bienvenido a tu lista compartida 👋</h1>
      <p>Aquí podrás ver tus listas, crear nuevas y colaborar con otros usuarios.</p>
    </div>
  `,
  styles: [`
    .welcome {
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
      color: #3B82F6;
    }

    p {
      color: #6B7280;
    }
  `]
})
export class WelcomeComponent { }

