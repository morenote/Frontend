import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivationEnd, Router} from '@angular/router';
import {_HttpClient} from '@delon/theme';
import {Subscription, zip} from 'rxjs';
import {filter} from 'rxjs/operators';
import {ConfigService} from "../../../../services/config/config.service";
import {WebsiteConfig} from "../../../../models/config/website-config";
import {UserService} from "../../../../services/User/user.service";

@Component({
  selector: 'app-account-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProAccountCenterComponent implements OnInit, OnDestroy {
  config?: WebsiteConfig;

  constructor(private router: Router,
              private configService: ConfigService,
              private userService: UserService,
              private http: _HttpClient, private cdr: ChangeDetectorRef) {
    this.config = configService.GetWebSiteConfig();
  }

  private router$!: Subscription;
  @ViewChild('tagInput', {static: false}) private tagInput!: ElementRef<HTMLInputElement>;
  user: any;
  notice: any;
  tabs = [
    {
      key: 'projects',
      tab: '概览 (8)'
    },
    {
      key: 'documents',
      tab: '文档库 (8)'
    },
    {
      key: 'files',
      tab: '文件库 (8)'
    },
    {
      key: 'articles',
      tab: '收藏夹 (8)'
    }

  ];
  pos = 0;
  taging = false;
  tagValue = '';

  private setActive(): void {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs.findIndex(w => w.key === key);
    if (idx !== -1) {
      this.pos = idx;
    }
  }

  async ngOnInit() {
    //获得用户信息
    let userInfo = await this.userService.GetUserInfo();

    zip(this.http.get(this.config?.baseURL + '/api/user/current'), this.http.get(this.config?.baseURL + '/api/notice')).subscribe(([user, notice]) => {
      this.user = user;
      this.user.name = userInfo.Username;
      this.notice = notice;
      this.cdr.detectChanges();
    });


    this.router$ = this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(() => this.setActive());
    this.setActive();
  }

  to(item: { key: string }): void {
    this.router.navigateByUrl(`/pro/account/center/${item.key}`);
  }

  tagShowIpt(): void {
    this.taging = true;
    this.cdr.detectChanges();
    this.tagInput.nativeElement.focus();
  }

  tagBlur(): void {
    const {user, cdr, tagValue} = this;
    if (tagValue && user.tags.filter((tag: { label: string }) => tag.label === tagValue).length === 0) {
      user.tags.push({label: tagValue});
    }
    this.tagValue = '';
    this.taging = false;
    cdr.detectChanges();
  }

  tagEnter(e: KeyboardEvent): void {
    if (e.keyCode === 13) {
      this.tagBlur();
    }
  }

  ngOnDestroy(): void {
    this.router$.unsubscribe();
  }
}
