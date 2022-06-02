import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMoalComponent } from './select-moal.component';

describe('SelectMoalComponent', () => {
  let component: SelectMoalComponent;
  let fixture: ComponentFixture<SelectMoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMoalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
