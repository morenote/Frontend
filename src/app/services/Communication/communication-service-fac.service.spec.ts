import { TestBed } from '@angular/core/testing';

import { TelegramFacService } from './telegram-fac.service';

describe('CommunicationServiceFacService', () => {
  let service: TelegramFacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelegramFacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
