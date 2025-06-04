import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../interfaces/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8000/api';

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

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería enviar login', () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    service.login(credentials).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería obtener el perfil del usuario', () => {
    const mockUser: User = { id: 1, name: 'Test', email: 'test@example.com' };
    localStorage.setItem('token', '1234');

    service.getProfile().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/profile`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer 1234');
    req.flush(mockUser);
  });

  it('debería registrar un usuario', () => {
    const data = {
      name: 'Test',
      email: 'test@example.com',
      password: '12345678',
      password_confirmation: '12345678',
      role: 'user'
    };
    service.register(data).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería cerrar sesión', () => {
    service.logout().subscribe();
    const req = httpMock.expectOne(`${apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería enviar email para recuperar contraseña', () => {
    service.forgot({ email: 'test@example.com' }).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/forgot-password`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería hacer reset de contraseña', () => {
    const payload = {
      token: 'token123',
      email: 'test@example.com',
      password: '12345678',
      password_confirmation: '12345678'
    };
    service.reset(payload).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/reset-password`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería verificar si el usuario está autenticado', () => {
    localStorage.setItem('token', 'abc123');
    expect(service.isAuthenticated()).toBeTrue();

    localStorage.removeItem('token');
    expect(service.isAuthenticated()).toBeFalse();
  });
});
