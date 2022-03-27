import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextbusEditorComponent } from './textbus-editor.component';

describe('TextBUSEditorComponent', () => {
  let component: TextbusEditorComponent;
  let fixture: ComponentFixture<TextbusEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextbusEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextbusEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
