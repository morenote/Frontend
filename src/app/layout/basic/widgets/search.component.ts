import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import {FormsModule} from "@angular/forms";
import {I18nPipe} from "@delon/theme";
import {NgTemplateOutlet} from "@angular/common";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {SHARED_IMPORTS} from "@shared";

@Component({
  selector: 'header-search',
  template: `
    <nz-input-group [nzPrefix]="iconTpl" [nzSuffix]="loadingTpl">
      <ng-template #iconTpl>
        <i nz-icon [nzType]="focus ? 'arrow-down' : 'search'"></i>
      </ng-template>
      <ng-template #loadingTpl>
        <i *ngIf="loading" nz-icon nzType="loading"></i>
      </ng-template>
      <input
        type="text"
        nz-input
        [(ngModel)]="q"
        [nzAutocomplete]="auto"
        (input)="search($event)"
        (focus)="qFocus()"
        (blur)="qBlur()"
        [attr.placeholder]="'menu.search.placeholder' | i18n"
      />
    </nz-input-group>
    <nz-autocomplete nzBackfill #auto>
      <nz-auto-option *ngFor="let i of options" [nzValue]="i">{{ i }}</nz-auto-option>
    </nz-autocomplete>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS,FormsModule, I18nPipe, NgTemplateOutlet, NzInputModule, NzIconModule, NzAutocompleteModule]
})
export class HeaderSearchComponent implements AfterViewInit, OnDestroy {
  q = '';
  qIpt: HTMLInputElement | null = null;
  options: string[] = [];
  search$ = new BehaviorSubject('');
  loading = false;

  @HostBinding('class.alain-default__search-focus')
  focus = false;
  @HostBinding('class.alain-default__search-toggled')
  searchToggled = false;

  @Input()
  set toggleChange(value: boolean) {
    if (typeof value === 'undefined') {
      return;
    }
    this.searchToggled = value;
    this.focus = value;
    if (value) {
      setTimeout(() => this.qIpt!.focus());
    }
  }
  @Output() readonly toggleChangeChange = new EventEmitter<boolean>();

  constructor(private el: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.qIpt = this.el.nativeElement.querySelector('.ant-input') as HTMLInputElement;
    this.search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap({
          complete: () => {
            this.loading = true;
          }
        })
      )
      .subscribe(value => {
        this.options = value ? [value, value + value, value + value + value] : [];
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  qFocus(): void {
    this.focus = true;
  }

  qBlur(): void {
    this.focus = false;
    this.searchToggled = false;
    this.options.length = 0;
    this.toggleChangeChange.emit(false);
  }

  search(ev: Event): void {
    this.search$.next((ev.target as HTMLInputElement).value);
  }

  ngOnDestroy(): void {
    this.search$.complete();
    this.search$.unsubscribe();
  }
}
