import { TestBed } from '@angular/core/testing';

import { NotesRepositoryService } from './notes-repository.service';

describe('NotesRepositoryService', () => {
  let service: NotesRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
