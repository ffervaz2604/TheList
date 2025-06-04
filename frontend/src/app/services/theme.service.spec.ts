import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();

    // Limpiar clases del body
    document.body.classList.remove('light-theme', 'dark-theme');

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  it('debería crearse el servicio y establecer tema light por defecto', () => {
    expect(service).toBeTruthy();
    expect(document.body.classList.contains('light-theme')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('debería establecer tema dark si está guardado en localStorage', () => {
    localStorage.setItem('theme', 'dark');
    // Crear nuevo servicio para disparar constructor de nuevo
    service = new ThemeService();

    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });

  it('debería alternar el tema correctamente', () => {
    service.setTheme('light');
    expect(service.isDarkTheme).toBeFalse();

    service.toggleTheme();
    expect(service.isDarkTheme).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggleTheme();
    expect(service.isDarkTheme).toBeFalse();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('setTheme debería aplicar la clase y guardar en localStorage', () => {
    service.setTheme('dark');
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark');

    service.setTheme('light');
    expect(document.body.classList.contains('light-theme')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('isDarkTheme debería reflejar la clase en body', () => {
    service.setTheme('dark');
    expect(service.isDarkTheme).toBeTrue();

    service.setTheme('light');
    expect(service.isDarkTheme).toBeFalse();
  });
});
