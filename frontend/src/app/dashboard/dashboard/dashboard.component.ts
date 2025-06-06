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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
export class DashboardComponent implements OnInit {
  isCollapsed = true;
  isDark = false;
  drawerOpened = false;

  constructor(
    public themeService: ThemeService,
    private breakpointObserver: BreakpointObserver,
    private translocoService: TranslocoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        if (result.matches) {
          this.isCollapsed = true;
        }
      });
  }

  toggleSidebar(): void {
    if (this.isCollapsed) {
      this.drawerOpened = !this.drawerOpened;
    } else {
      this.isCollapsed = true;
      this.drawerOpened = true;
    }
  }


  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDark = this.themeService.isDarkTheme;
  }

  toggleLang(): void {
    const lang = this.translocoService.getActiveLang();
    const newLang = lang === 'es' ? 'en' : 'es';
    this.translocoService.setActiveLang(newLang);
    localStorage.setItem('lang', newLang);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}