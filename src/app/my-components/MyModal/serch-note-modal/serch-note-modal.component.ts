import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MyDataSource} from "../../../services/Search/NoteSearch/my-data-source";
import {HttpClient} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-serch-note-modal',
  templateUrl: './serch-note-modal.component.html',

  styleUrls: ['./serch-note-modal.component.less']
})
export class SerchNoteModalComponent implements OnInit {

  public ds: MyDataSource;

  private destroy$ = new Subject();


  isVisible = false;
  isOkLoading = false;
  public result?: boolean;
  public value?: string;


  public key!: string;
  public noteRepositoryId!: string;

  title: string = '';
  placeholder: string = '';

  constructor(private http: HttpClient, public nzMessage: NzMessageService, public myDataSource: MyDataSource) {
    this.ds = myDataSource;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next(0);
    this.destroy$.complete();
  }

  func: any;

  public showModal(title: string, placeholder: string, func: any): void {
    this.title = title;
    this.placeholder = placeholder;
    this.isVisible = true;
    this.func = func;
  }

  public clearValue() {
    this.value = '';
  }

  public setValue(value: string) {
    this.value = value;
  }

  handleOk(): void {
    this.func(true, this.value);
    this.isVisible = false;
    this.isOkLoading = false;
  }

  handleCancel(): void {
    this.func(false, this.value);
    this.isVisible = false;
    this.result = false;
  }

  onKeyup(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      //按下回车
      let key = this.value;
      if (key) {
        console.log('按下回车')
        this.ds.key = key;
        this.ds.update(0);
        this.ds
          .completed()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.nzMessage.warning('Infinite List loaded all');
          });
      }
    }

  }
}
