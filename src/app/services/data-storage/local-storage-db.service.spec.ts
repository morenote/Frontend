import { TestBed } from '@angular/core/testing';

import { LocalStorageDBService } from './local-storage-db.service';

describe('LocalStorageDBService', () => {
  let service: LocalStorageDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
