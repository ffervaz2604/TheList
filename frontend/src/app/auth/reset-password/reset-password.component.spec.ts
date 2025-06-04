import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../services/auth.service';
import { provideTransloco, TranslocoLoader } from '@ngneat/transloco';

class FakeTranslocoLoader implements TranslocoLoader {
  getTranslation() {
    return of({});
  }
}

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      reset: jasmine.createSpy().and.returnValue(of({}))
    };
    mockRouter = {
      navigate: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
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
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => key === 'token' ? 'mock-token' : 'test@example.com'
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
  });

  it('debería tener el formulario inválido al inicio', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería validar que las contraseñas coinciden', () => {
    component.form.setValue({
      password: '123456',
      password_confirmation: '654321'
    });
    expect(component.form.valid).toBeFalse();
    component.form.setValue({
      password: '123456',
      password_confirmation: '123456'
    });
    expect(component.form.valid).toBeTrue();
  });

  it('debería llamar a authService.reset si el formulario es válido', () => {
    component.form.setValue({
      password: '123456',
      password_confirmation: '123456'
    });
    component.onSubmit();
    expect(mockAuthService.reset).toHaveBeenCalledWith({
      token: 'mock-token',
      email: 'test@example.com',
      password: '123456',
      password_confirmation: '123456'
    });
  });

  it('debería manejar error del servidor', () => {
    mockAuthService.reset.and.returnValue(throwError(() => ({ status: 400 })));
    component.form.setValue({
      password: '123456',
      password_confirmation: '123456'
    });
    component.onSubmit();
    expect(component.errorMessage).toBe('El enlace no es válido o ha expirado.');
  });

  it('debería navegar al login después de éxito', fakeAsync(() => {
    component.form.setValue({
      password: '123456',
      password_confirmation: '123456'
    });
    component.onSubmit();
    tick(2000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
