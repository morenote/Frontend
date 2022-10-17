import { TestBed } from '@angular/core/testing';

import { VirtualFileAccessService } from './virtual-file-access.service';

describe('VirtualFileAccessService', () => {
  let service: VirtualFileAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualFileAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
