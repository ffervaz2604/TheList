import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let httpMock: HttpTestingController;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ProfileComponent, ReactiveFormsModule, HttpClientTestingModule, TranslocoTestingModule],
            providers: [{ provide: Router, useValue: routerSpy }]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    function flushProfileRequest(mockUser = { name: 'Usuario', email: 'test@test.com', role: 'admin' }) {
        const req = httpMock.expectOne('http://localhost:8000/api/profile');
        expect(req.request.method).toBe('GET');
        req.flush(mockUser);
    }

    it('debería crear el componente', fakeAsync(() => {
        fixture.detectChanges();
        flushProfileRequest();
        tick();
        expect(component).toBeTruthy();
    }));

    it('debería cargar el perfil correctamente', fakeAsync(() => {
        fixture.detectChanges();
        flushProfileRequest();
        tick();

        expect(component.form.value.name).toBe('Usuario');
        expect(component.form.value.email).toBe('test@test.com');
        expect(component.isLoading).toBeFalse();
    }));

    it('debería mostrar error si falla la carga del perfil', fakeAsync(() => {
        fixture.detectChanges();
        const req = httpMock.expectOne('http://localhost:8000/api/profile');
        req.error(new ProgressEvent('error'));
        tick();

        expect(component.errorMessage).toBe('No se pudo cargar el perfil');
        expect(component.isLoading).toBeFalse();
    }));

    it('debería actualizar el perfil correctamente', fakeAsync(() => {
        fixture.detectChanges();
        flushProfileRequest();
        tick();

        component.form.patchValue({ name: 'Nuevo', email: 'nuevo@test.com', role: 'admin' });

        component.onSubmit();
        const updateReq = httpMock.expectOne('http://localhost:8000/api/profile');
        expect(updateReq.request.method).toBe('PUT');
        updateReq.flush({});

        tick();
        expect(component.successMessage).toBe('Perfil actualizado con éxito');
    }));

    it('debería mostrar error al fallar la actualización', fakeAsync(() => {
        fixture.detectChanges();
        flushProfileRequest();
        tick();

        component.onSubmit();
        const updateReq = httpMock.expectOne('http://localhost:8000/api/profile');
        updateReq.error(new ProgressEvent('error'));

        tick();
        expect(component.errorMessage).toBe('Error al actualizar el perfil');
    }));

    it('debería navegar a cambio de contraseña', fakeAsync(() => {
        fixture.detectChanges();
        flushProfileRequest();
        tick();

        component.cambiarContrasena();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard/change-password']);
    }));
});
