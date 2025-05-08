import { TestBed } from '@angular/core/testing';

import { CustomSrvService } from './custom-srv.service';

describe('CustomSrvService', () => {
  let service: CustomSrvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomSrvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
