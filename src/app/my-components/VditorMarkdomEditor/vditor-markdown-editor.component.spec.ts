import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VditorMarkdownEditorComponent } from './vditor-markdown-editor.component';

describe('MyVditorComponent', () => {
  let component: VditorMarkdownEditorComponent;
  let fixture: ComponentFixture<VditorMarkdownEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VditorMarkdownEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VditorMarkdownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
