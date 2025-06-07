import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatCardModule, TranslocoModule, RouterModule, MatIcon, MatProgressSpinner],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  summary: DashboardSummary | null = null;
  loading = true;
  error = '';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el resumen';
        this.loading = false;
      }
    });
  }

  get hasAnyData(): boolean {
    if (!this.summary) return false;
    return (
      (this.summary.activeLists ?? 0) > 0 ||
      (this.summary.pendingProducts ?? 0) > 0 ||
      (this.summary.sharedLists ?? 0) > 0 ||
      (this.summary.completedProducts ?? 0) > 0
    );
  }
}
