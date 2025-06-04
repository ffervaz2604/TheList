import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../services/auth.service';
import { provideTransloco, TranslocoLoader } from '@ngneat/transloco';

class FakeTranslocoLoader implements TranslocoLoader {
  getTranslation() {
    return of({});
  }
}

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      forgot: jasmine.createSpy().and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordComponent,
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
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido al inicio', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería llamar a authService.forgot si el formulario es válido', () => {
    component.form.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(mockAuthService.forgot).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('debería mostrar mensaje de éxito si el correo se envía correctamente', () => {
    component.form.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.successMessage).toBe('Te hemos enviado un correo para restablecer la contraseña.');
    expect(component.errorMessage).toBeNull();
  });

  it('debería manejar error si el correo no se puede enviar', () => {
    mockAuthService.forgot.and.returnValue(throwError(() => ({ status: 400 })));

    component.form.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Error al enviar el correo. Asegúrate de que el email es válido.');
    expect(component.successMessage).toBeNull();
  });
});
