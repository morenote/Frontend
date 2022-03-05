import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VditorMarkdomEditorComponent } from './vditor-markdom-editor.component';

describe('MyVditorComponent', () => {
  let component: VditorMarkdomEditorComponent;
  let fixture: ComponentFixture<VditorMarkdomEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VditorMarkdomEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VditorMarkdomEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
