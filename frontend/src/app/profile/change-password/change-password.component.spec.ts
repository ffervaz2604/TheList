import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';

describe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;
    let httpMock: HttpTestingController;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                ChangePasswordComponent,
                ReactiveFormsModule,
                HttpClientTestingModule,
                TranslocoTestingModule
            ],
            providers: [
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería mostrar mensaje de éxito y redirigir tras cambiar contraseña', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue('fake-token');
        spyOn(localStorage, 'removeItem');

        component.form.setValue({
            current_password: 'oldpass',
            new_password: 'newpassword',
            new_password_confirmation: 'newpassword'
        });

        component.onSubmit();

        const req = httpMock.expectOne('http://localhost:8000/api/change-password');
        expect(req.request.method).toBe('PUT');
        req.flush({});

        expect(component.successMessage).toContain('Contraseña actualizada correctamente');

        tick(2000); // Simula delay
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('debería mostrar mensaje de error si la petición falla', () => {
        spyOn(localStorage, 'getItem').and.returnValue('fake-token');

        component.form.setValue({
            current_password: 'oldpass',
            new_password: 'newpassword',
            new_password_confirmation: 'newpassword'
        });

        component.onSubmit();

        const req = httpMock.expectOne('http://localhost:8000/api/change-password');
        req.flush({}, { status: 400, statusText: 'Bad Request' });

        expect(component.errorMessage).toBe('Error al actualizar la contraseña.');
    });

    it('debería marcar el formulario como inválido si las contraseñas no coinciden', () => {
        component.form.setValue({
            current_password: 'oldpass',
            new_password: 'newpassword',
            new_password_confirmation: 'differentpass'
        });

        expect(component.form.invalid).toBeTrue();
    });

    afterEach(() => {
        httpMock.verify();
    });
});
