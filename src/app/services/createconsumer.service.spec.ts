import { TestBed } from '@angular/core/testing';

import { CreateconsumerService } from './createconsumer.service';

describe('CreateconsumerService', () => {
  let service: CreateconsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateconsumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
