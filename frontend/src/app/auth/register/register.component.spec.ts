import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTransloco, TranslocoLoader } from '@ngneat/transloco';
import { RegisterComponent } from '../../../../src/app/auth/register/register.component';
import { AuthService } from '../../../../src/app/services/auth.service';

class FakeTranslocoLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    return of({
      'register.title': 'Registro',
      'register.name': 'Nombre',
      'register.email': 'Correo',
      'register.password': 'Contraseña',
      'register.password_confirmation': 'Confirmar contraseña',
      'register.role': 'Rol',
      'register.submit': 'Registrar',
      'register.already_have_account': '¿Ya tienes cuenta?',
      'register.role_option_admin': 'Administrador',
      'register.role_option_collaborator': 'Colaborador'
    });
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = {
      register: jasmine.createSpy().and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
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

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido al inicio', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('debería validar que las contraseñas coincidan', () => {
    component.registerForm.setValue({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
      password_confirmation: '654321',
      role: 'admin'
    });

    expect(component.registerForm.valid).toBeFalse();
    expect(component.registerForm.errors?.['mismatch']).toBeTrue();
  });

  it('debería llamar a authService.register si el formulario es válido', () => {
    component.registerForm.setValue({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
      password_confirmation: '123456',
      role: 'admin'
    });

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith(component.registerForm.value);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería manejar error del servidor', () => {
    mockAuthService.register.and.returnValue(throwError(() => ({ error: { message: 'Error al registrar' } })));

    component.registerForm.setValue({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
      password_confirmation: '123456',
      role: 'admin'
    });

    component.onSubmit();

    expect(component.serverError).toBe('Error al registrar');
  });
});
