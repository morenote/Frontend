import { TestBed } from '@angular/core/testing';

import { LoginAuditService } from './login-audit.service';

describe('LoginAuditService', () => {
  let service: LoginAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
