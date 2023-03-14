import { TestBed } from '@angular/core/testing';

import { PasswordDerivationService } from './password-derivation.service';

describe('PasswordDerivationService', () => {
  let service: PasswordDerivationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordDerivationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
