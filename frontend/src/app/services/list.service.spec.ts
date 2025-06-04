import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ListService } from './list.service';

describe('ListService', () => {
  let service: ListService;
  let httpMock: HttpTestingController;
  const token = 'test-token';
  const headers = { Authorization: `Bearer ${token}` };

  beforeEach(() => {
    localStorage.setItem('token', token);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ListService]
    });

    service = TestBed.inject(ListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería obtener todas las listas', () => {
    service.getAll().subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(headers.Authorization);
    req.flush({ data: [] });
  });

  it('debería crear una lista', () => {
    const data = { name: 'Nueva lista' };
    service.create(data).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debería actualizar una lista', () => {
    const data = { name: 'Editada' };
    service.update(1, data).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('debería eliminar una lista', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería agregar un producto', () => {
    const product = { name: 'Producto 1', quantity: 2 };
    service.addProduct(1, product).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists/1/products');
    expect(req.request.method).toBe('POST');
    req.flush({ data: product });
  });

  it('debería actualizar un producto', () => {
    const update = { purchased: true };
    service.updateProduct(5, update).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/products/5');
    expect(req.request.method).toBe('PUT');
    req.flush({ data: update });
  });

  it('debería eliminar un producto', () => {
    service.deleteProduct(5).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/products/5');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Producto eliminado' });
  });

  it('debería obtener listas archivadas', () => {
    service.getArchived().subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists/archived');
    expect(req.request.method).toBe('GET');
    req.flush({ data: [] });
  });

  it('debería desarchivar una lista', () => {
    service.unarchiveList(3).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists/3');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ archived: false });
    req.flush({ data: {} });
  });

  it('debería compartir una lista', () => {
    service.shareList(1, 'test@example.com').subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists/1/share');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });
    req.flush({ message: 'Compartida' });
  });

  it('debería revocar un acceso compartido', () => {
    service.revokeShare(1, 2).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists/1/shared-users/2');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Revocado' });
  });

  it('debería obtener usuarios compartidos', () => {
    service.getSharedUsers(1).subscribe();
    const req = httpMock.expectOne('http://localhost:8000/api/lists/1/shared-users');
    expect(req.request.method).toBe('GET');
    req.flush({ data: [] });
  });
});
