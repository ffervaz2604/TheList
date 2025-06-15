import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent { }

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['forgot']);

        await TestBed.configureTestingModule({
            imports: [
                ForgotPasswordComponent,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    { path: 'login', component: DummyComponent }
                ]),
                TranslocoTestingModule.forRoot({
                    langs: {
                        "es": {
                            "forgot-password": {
                                "title": "¿Has olvidado tu contraseña?",
                                "email": "Correo electrónico",
                                "submit": "Enviar",
                                "back-to-login": "Volver al inicio de sesión"
                            }
                        }
                    },
                    translocoConfig: {
                        availableLangs: ['es'],
                        defaultLang: 'es',
                        reRenderOnLangChange: true
                    }
                })
            ],
            providers: [
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería mostrar mensaje de éxito si se envía correctamente', fakeAsync(() => {
        authServiceSpy.forgot.and.returnValue(of({}));
        component.form.setValue({ email: 'test@test.com' });

        component.onSubmit();
        tick();

        expect(component.isLoading).toBeFalse();
        expect(component.successMessage).toBeTruthy();
        expect(component.errorMessage).toBeNull();
    }));

    it('debería mostrar mensaje de error si falla el envío', fakeAsync(() => {
        authServiceSpy.forgot.and.returnValue(throwError(() => ({})));
        component.form.setValue({ email: 'test@test.com' });

        component.onSubmit();
        tick();

        expect(component.isLoading).toBeFalse();
        expect(component.errorMessage).toContain('Error');
        expect(component.successMessage).toBeNull();
    }));

    it('no debería enviar si el formulario es inválido', () => {
        component.form.setValue({ email: '' });

        component.onSubmit();

        expect(authServiceSpy.forgot).not.toHaveBeenCalled();
        expect(component.isLoading).toBeFalse();
    });
});
