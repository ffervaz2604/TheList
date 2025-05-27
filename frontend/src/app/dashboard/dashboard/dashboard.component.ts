import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslocoModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ThemeService]
})
export class DashboardComponent {
  constructor(
    public themeService: ThemeService,
    public translocoService: TranslocoService
  ) { }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLang(): void {
    const lang = this.translocoService.getActiveLang();
    const newLang = lang === 'es' ? 'en' : 'es';
    this.translocoService.setActiveLang(newLang);
    localStorage.setItem('lang', newLang);
  }

  get isDark(): boolean {
    return this.themeService.isDarkTheme;
  }
}
