import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
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
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    TranslocoModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ThemeService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  isMobile = false;
  drawerOpened: boolean = true;

  constructor(
    public themeService: ThemeService,
    public translocoService: TranslocoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkIfMobile.bind(this));
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.drawerOpened = false;
    } else {
      this.drawerOpened = true;
    }
  }

  toggleDrawer(): void {
    this.drawerOpened = !this.drawerOpened;
  }

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

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
