import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <aside class="sidebar">
      <nav>
        <ul>
          <li><a routerLink="/dashboard" routerLinkActive="active">Inicio</a></li>
          <li><a routerLink="/profile" routerLinkActive="active">Mi perfil</a></li>
          <li><a routerLink="/shared-lists" routerLinkActive="active">Listas compartidas</a></li>
          <li><a (click)="logout()">Cerrar sesión</a></li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #1F2937;
      color: white;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    nav ul {
      list-style: none;
      padding: 0;
    }

    nav li {
      margin-bottom: 1rem;
    }

    a {
      color: white;
      text-decoration: none;
    }

    .active {
      font-weight: bold;
    }
  `]
})
export class SidebarComponent {
  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
