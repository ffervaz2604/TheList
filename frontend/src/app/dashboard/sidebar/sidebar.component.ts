import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatListModule, MatCardModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
