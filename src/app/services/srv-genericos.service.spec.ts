import { TestBed } from '@angular/core/testing';

import { SrvGenericosService } from './srv-genericos.service';

describe('SrvGenericosService', () => {
  let service: SrvGenericosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrvGenericosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
