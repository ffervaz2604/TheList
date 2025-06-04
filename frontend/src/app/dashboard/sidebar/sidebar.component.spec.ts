import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTransloco, TranslocoLoader } from '@ngneat/transloco';
import { of } from 'rxjs';
import { Router } from '@angular/router';

class FakeTranslocoLoader implements TranslocoLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidebarComponent, RouterTestingModule.withRoutes([])],
            providers: [
                provideTransloco({
                    config: {
                        availableLangs: ['es'],
                        defaultLang: 'es',
                        fallbackLang: 'es',
                        reRenderOnLangChange: true,
                        prodMode: true
                    },
                    loader: FakeTranslocoLoader
                })
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería eliminar el token y redirigir al login al cerrar sesión', () => {
        localStorage.setItem('token', 'test-token');
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');

        component.logout();

        expect(localStorage.getItem('token')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
});
