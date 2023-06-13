import { TestBed } from '@angular/core/testing';

import { MessageUIService } from './message-ui.service';

describe('MessageUIService', () => {
  let service: MessageUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
