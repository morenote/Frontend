import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchNoteModalComponent } from './serch-note-modal.component';

describe('SerchNoteModalComponent', () => {
  let component: SerchNoteModalComponent;
  let fixture: ComponentFixture<SerchNoteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerchNoteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerchNoteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
