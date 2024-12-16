import { TestBed } from '@angular/core/testing';

import { HttpsecurityService } from './httpsecurity.service';

describe('HttpsecurityService', () => {
  let service: HttpsecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpsecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
