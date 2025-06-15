import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent { }

describe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['reset']);

        await TestBed.configureTestingModule({
            imports: [
                ResetPasswordComponent,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    { path: 'login', component: DummyComponent }
                ]),
                TranslocoTestingModule.forRoot({
                    langs: {
                        es: {
                            'reset-password': {
                                title: 'Restablecer contraseña',
                                password: 'Nueva contraseña',
                                password_confirmation: 'Confirmar contraseña',
                                submit: 'Restablecer'
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
                { provide: AuthService, useValue: authServiceSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) =>
                                    key === 'token' ? 'mock-token' : 'test@test.com'
                            }
                        }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
        expect(component.token).toBe('mock-token');
        expect(component.email).toBe('test@test.com');
    });

    it('debería mostrar éxito si la contraseña se restablece correctamente', fakeAsync(() => {
        authServiceSpy.reset.and.returnValue(of({}));
        component.form.setValue({
            password: '123456',
            password_confirmation: '123456'
        });

        component.onSubmit();
        tick();

        expect(component.successMessage).toContain('Contraseña actualizada');
        expect(component.errorMessage).toBeNull();
        expect(component.isLoading).toBeFalse();
    }));

    it('debería mostrar error si el restablecimiento falla', fakeAsync(() => {
        authServiceSpy.reset.and.returnValue(throwError(() => ({})));
        component.form.setValue({
            password: '123456',
            password_confirmation: '123456'
        });

        component.onSubmit();
        tick();

        expect(component.errorMessage).toContain('no es válido');
        expect(component.successMessage).toBeNull();
        expect(component.isLoading).toBeFalse();
    }));

    it('no debería enviar si el formulario es inválido', () => {
        component.form.setValue({
            password: '123456',
            password_confirmation: '000000'
        });

        component.onSubmit();

        expect(authServiceSpy.reset).not.toHaveBeenCalled();
        expect(component.isLoading).toBeFalse();
    });
});
