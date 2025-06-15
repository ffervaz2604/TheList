import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent { }

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let userServiceSpy: jasmine.SpyObj<UserService>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getProfile']);
        userServiceSpy = jasmine.createSpyObj('UserService', ['set']);

        await TestBed.configureTestingModule({
            imports: [
                LoginComponent,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    { path: 'dashboard', component: DummyComponent }
                ]),
                TranslocoTestingModule.forRoot({
                    langs: {
                        es: {
                            login: {
                                title: 'Iniciar sesión',
                                email: 'Correo',
                                password: 'Contraseña',
                                submit: 'Acceder',
                                forgot: '¿Olvidaste tu contraseña?',
                                register: 'Registrarse'
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
                { provide: UserService, useValue: userServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería mostrar error si el login falla por credenciales', fakeAsync(() => {
        authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));
        component.loginForm.setValue({ email: 'test@test.com', password: 'wrongpass' });

        component.onSubmit();
        tick();

        expect(component.serverError).toBe('Correo o contraseña incorrectos.');
        expect(component.isLoading).toBeFalse();
    }));

    it('debería navegar al dashboard si el login y el perfil son correctos', fakeAsync(() => {
        const token = 'abc123';
        authServiceSpy.login.and.returnValue(of({ token }));
        authServiceSpy.getProfile.and.returnValue(of({ id: 1, name: 'User', email: 'user@test.com' }));
        component.loginForm.setValue({ email: 'user@test.com', password: '123456' });

        component.onSubmit();
        tick();

        expect(localStorage.getItem('token')).toBe(token);
        expect(userServiceSpy.set).toHaveBeenCalled();
    }));
});
