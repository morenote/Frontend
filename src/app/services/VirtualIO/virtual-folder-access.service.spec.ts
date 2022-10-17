import { TestBed } from '@angular/core/testing';

import { VirtualFolderAccessService } from './virtual-folder-access.service';

describe('VirtualFolderAccessService', () => {
  let service: VirtualFolderAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualFolderAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
