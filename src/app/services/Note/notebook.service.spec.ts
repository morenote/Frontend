import { TestBed } from '@angular/core/testing';

import { NoteCollectionService } from './note-collection.service';

describe('NotebookService', () => {
  let service: NoteCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
