import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ThemeService } from '../../services/theme.service';
import { provideTransloco, TranslocoLoader } from '@ngneat/transloco';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class FakeThemeService {
    isDarkTheme = false;
    toggleTheme = jasmine.createSpy();
}

class FakeTranslocoLoader implements TranslocoLoader {
    getTranslation(lang: string) {
        return of({
            dashboard: {
                title: 'Título del dashboard',
                toggle_theme: 'Alternar tema'
            }
        });
    }
}

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let themeService: FakeThemeService;

    beforeEach(async () => {
        themeService = new FakeThemeService();

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                { provide: ThemeService, useValue: themeService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => null
                            }
                        }
                    }
                },
                provideTransloco({
                    config: {
                        availableLangs: ['es', 'en'],
                        defaultLang: 'es',
                        fallbackLang: 'es',
                        reRenderOnLangChange: true,
                        prodMode: true
                    },
                    loader: FakeTranslocoLoader
                })
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería detectar si la pantalla es móvil', () => {
        spyOnProperty(window, 'innerWidth').and.returnValue(600);
        component.checkIfMobile();
        expect(component.isMobile).toBeTrue();
    });

    it('debería alternar el idioma entre es y en', () => {
        localStorage.setItem('lang', 'es');
        component.toggleLang();
        expect(localStorage.getItem('lang')).toBe('en');
    });

    it('debería alternar el tema', () => {
        component.toggleTheme();
        expect(themeService.toggleTheme).toHaveBeenCalled();
    });
});
