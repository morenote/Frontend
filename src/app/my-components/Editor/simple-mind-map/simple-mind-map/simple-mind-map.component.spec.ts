import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMindMapComponent } from './simple-mind-map.component';

describe('SimpleMindMapComponent', () => {
  let component: SimpleMindMapComponent;
  let fixture: ComponentFixture<SimpleMindMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMindMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleMindMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
