import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
  private readonly storageKey = 'theme';

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    this.setTheme(saved === 'dark' ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const isDark = document.body.classList.contains('dark-theme');
    this.setTheme(isDark ? 'light' : 'dark');
  }

  setTheme(theme: 'light' | 'dark'): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem(this.storageKey, theme);
  }

  get isDarkTheme(): boolean {
    return document.body.classList.contains('dark-theme');
  }
}
