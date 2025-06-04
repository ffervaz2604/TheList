import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ThemeService } from '../../services/theme.service';
import { TranslocoService, provideTransloco, TranslocoLoader } from '@ngneat/transloco';
import { of } from 'rxjs';

class FakeThemeService {
    isDarkTheme = false;
    toggleTheme = jasmine.createSpy();
}

class FakeTranslocoService {
    private currentLang = 'es';
    getActiveLang = jasmine.createSpy().and.callFake(() => this.currentLang);
    setActiveLang = jasmine.createSpy().and.callFake((lang: string) => this.currentLang = lang);
}

class FakeTranslocoLoader implements TranslocoLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let themeService: FakeThemeService;
    let translocoService: FakeTranslocoService;

    beforeEach(async () => {
        themeService = new FakeThemeService();
        translocoService = new FakeTranslocoService();

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                { provide: ThemeService, useValue: themeService },
                { provide: TranslocoService, useValue: translocoService },
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
        component.toggleLang();
        expect(translocoService.setActiveLang).toHaveBeenCalledWith('en');
        expect(localStorage.getItem('lang')).toBe('en');
    });

    it('debería alternar el tema', () => {
        component.toggleTheme();
        expect(themeService.toggleTheme).toHaveBeenCalled();
    });
});
