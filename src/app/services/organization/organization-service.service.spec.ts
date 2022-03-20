import { TestBed } from '@angular/core/testing';

import { OrganizationServiceService } from './organization-service.service';

describe('OrganizationServiceService', () => {
  let service: OrganizationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
