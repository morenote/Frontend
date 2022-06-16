import { TestBed } from '@angular/core/testing';

import { GMService } from './gm.service';

describe('GMService', () => {
  let service: GMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
