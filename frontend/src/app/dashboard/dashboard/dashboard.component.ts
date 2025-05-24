import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterModule],
  template: `
    <div class="dashboard-container">
      <app-sidebar></app-sidebar>
      <div class="dashboard-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
    }

    .dashboard-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
  `]
})
export class DashboardComponent { }

