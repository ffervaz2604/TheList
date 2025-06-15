import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    const apiUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('debería hacer login correctamente', () => {
        const credentials = { email: 'test@test.com', password: '123456' };

        service.login(credentials).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(`${apiUrl}/login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(credentials);
        req.flush({ token: 'fake-token' });
    });

    it('debería obtener el perfil del usuario', () => {
        const mockUser = { id: 1, name: 'Test', email: 'test@test.com' };
        localStorage.setItem('token', 'test-token');

        service.getProfile().subscribe(user => {
            expect(user).toEqual(mockUser);
        });

        const req = httpMock.expectOne(`${apiUrl}/profile`);
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
        req.flush(mockUser);
    });

    it('debería registrar un usuario', () => {
        const data = {
            name: 'Test',
            email: 'test@test.com',
            password: '123456',
            password_confirmation: '123456',
            role: 'colaborador'
        };

        service.register(data).subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(`${apiUrl}/register`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(data);
        req.flush({ success: true });
    });

    it('debería enviar email de recuperación', () => {
        const data = { email: 'test@test.com' };

        service.forgot(data).subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(`${apiUrl}/forgot-password`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(data);
        req.flush({ status: 'ok' });
    });

    it('debería restablecer la contraseña', () => {
        const payload = {
            token: 'abc',
            email: 'test@test.com',
            password: '123456',
            password_confirmation: '123456'
        };

        service.reset(payload).subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(`${apiUrl}/reset-password`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush({ status: 'success' });
    });

    it('debería cerrar sesión', () => {
        service.logout().subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(`${apiUrl}/logout`);
        expect(req.request.method).toBe('POST');
        req.flush({ status: 'logged out' });
    });

    it('debería verificar si el usuario está autenticado', () => {
        localStorage.setItem('token', 'abc123');
        expect(service.isAuthenticated()).toBeTrue();

        localStorage.removeItem('token');
        expect(service.isAuthenticated()).toBeFalse();
    });
});
