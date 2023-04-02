import { TestBed } from '@angular/core/testing';

import { UsbKeyManagerService } from './usb-key-manager.service';

describe('UsbKeyManagerService', () => {
  let service: UsbKeyManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsbKeyManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
