import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user';

describe('UserService', () => {
  let service: UserService;
  const testUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('set() debería guardar el usuario en la propiedad y localStorage', () => {
    service.set(testUser);
    expect(service['currentUser']).toEqual(testUser);
    const stored = localStorage.getItem('user');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual(testUser);
  });

  it('get() debería devolver usuario almacenado en memoria', () => {
    service['currentUser'] = testUser;
    const user = service.get();
    expect(user).toEqual(testUser);
  });

  it('get() debería recuperar usuario de localStorage si no está en memoria', () => {
    localStorage.setItem('user', JSON.stringify(testUser));
    service['currentUser'] = null;
    const user = service.get();
    expect(user).toEqual(testUser);
  });

  it('get() debería devolver null si no hay usuario en memoria ni localStorage', () => {
    localStorage.removeItem('user');
    service['currentUser'] = null;
    const user = service.get();
    expect(user).toBeNull();
  });

  it('clear() debería limpiar la propiedad y eliminar localStorage', () => {
    service.set(testUser);
    service.clear();
    expect(service['currentUser']).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
