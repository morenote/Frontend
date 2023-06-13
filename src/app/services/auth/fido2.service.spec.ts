import { TestBed } from '@angular/core/testing';

import { Fido2Service } from './fido2.service';

describe('Fido2Service', () => {
  let service: Fido2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fido2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
