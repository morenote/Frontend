import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePassWordModalComponentComponent } from './change-pass-word-modal-component.component';

describe('ChangePassWordModalComponentComponent', () => {
  let component: ChangePassWordModalComponentComponent;
  let fixture: ComponentFixture<ChangePassWordModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePassWordModalComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePassWordModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
