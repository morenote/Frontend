import { TestBed } from '@angular/core/testing';

import { SJJ1962Service } from './s-j-j1962.service';

describe('SJ1962Service', () => {
  let service: SJJ1962Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SJJ1962Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
