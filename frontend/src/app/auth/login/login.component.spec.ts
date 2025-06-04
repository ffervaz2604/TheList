import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { provideTransloco, TranslocoLoader } from '@ngneat/transloco';
import { LoginComponent } from '../../../../src/app/auth/login/login.component';
import { AuthService } from '../../../../src/app/services/auth.service';
import { UserService } from '../../../../src/app/services/user.service';

class FakeTranslocoLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    return of({
      'login.title': 'Iniciar sesión',
      'login.email': 'Correo electrónico',
      'login.password': 'Contraseña',
      'login.submit': 'Entrar',
      'login.forgot': '¿Olvidaste la contraseña?',
      'login.register': 'Registrarse',
      'login.error': 'Error en login'
    });
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockUserService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jasmine.createSpy().and.returnValue(of({ token: 'fake-token' })),
      getProfile: jasmine.createSpy().and.returnValue(of({ id: 1, name: 'Test User' }))
    };
    mockUserService = { set: jasmine.createSpy() };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
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
        }),
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido al inicio', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería llamar a authService.login con datos válidos', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456'
    });
  });

  it('debería mostrar error si el login falla', () => {
    mockAuthService.login.and.returnValue(throwError(() => ({ status: 401 })));
    component.loginForm.setValue({ email: 'test@example.com', password: 'wrong' });
    component.onSubmit();

    expect(component.serverError).toBe('Correo o contraseña incorrectos.');
  });
});
