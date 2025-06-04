import { TestBed } from '@angular/core/testing';

import { SharedListService } from './shared.service';

describe('ServiceService', () => {
  let service: SharedListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
