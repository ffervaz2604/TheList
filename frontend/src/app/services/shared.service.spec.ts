import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SharedListService } from './shared.service';

describe('SharedListService', () => {
  let service: SharedListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SharedListService]
    });
    service = TestBed.inject(SharedListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener las listas compartidas', () => {
    const mockResponse = { data: [{ id: 1, name: 'Lista compartida' }] };

    service.getSharedLists().subscribe((res) => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].name).toBe('Lista compartida');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/shared-lists');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
