import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmEditorComponent } from './am-editor.component';

describe('AmEditorComponent', () => {
  let component: AmEditorComponent;
  let fixture: ComponentFixture<AmEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
