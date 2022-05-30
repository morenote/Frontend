import { TestBed } from '@angular/core/testing';

import { EPass2001Service } from './e-pass2001.service';

describe('EPass2001Service', () => {
  let service: EPass2001Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EPass2001Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
