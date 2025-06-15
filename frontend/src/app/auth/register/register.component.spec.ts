import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent }
        ]),
        TranslocoTestingModule.forRoot({
          langs: {
            es: {
              register: {
                title: 'Registro',
                name: 'Nombre',
                email: 'Correo',
                password: 'Contraseña',
                password_confirmation: 'Confirmar contraseña',
                role: 'Rol',
                role_option_admin: 'Administrador',
                role_option_collaborator: 'Colaborador',
                submit: 'Crear cuenta',
                already_have_account: '¿Ya tienes cuenta?'
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar error si las contraseñas no coinciden', () => {
    component.registerForm.setValue({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      password_confirmation: '000000',
      role: 'colaborador'
    });

    expect(component.registerForm.valid).toBeFalse();
    expect(component.registerForm.errors?.['mismatch']).toBeTrue();
  });

  it('debería registrar correctamente y navegar a /login', fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of({}));
    component.registerForm.setValue({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      password_confirmation: '123456',
      role: 'colaborador'
    });

    component.onSubmit();
    tick();

    expect(component.isLoading).toBeFalse();
  }));

  it('debería mostrar mensaje de error si falla el registro', fakeAsync(() => {
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ error: { message: 'Registro fallido' } }))
    );

    component.registerForm.setValue({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      password_confirmation: '123456',
      role: 'colaborador'
    });

    component.onSubmit();
    tick();

    expect(component.serverError).toBe('Registro fallido');
    expect(component.isLoading).toBeFalse();
  }));
});
