import { TestBed } from '@angular/core/testing';

import { SecurityAuthService } from './security-auth.service';

describe('SecurityAuthService', () => {
  let service: SecurityAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
