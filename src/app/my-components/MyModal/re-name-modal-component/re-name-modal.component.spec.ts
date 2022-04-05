import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReNameModalComponent } from './re-name-modal.component';

describe('ReNameModalComponentComponent', () => {
  let component: ReNameModalComponent;
  let fixture: ComponentFixture<ReNameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReNameModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
