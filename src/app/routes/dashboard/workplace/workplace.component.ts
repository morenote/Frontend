import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {zip} from 'rxjs';
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {UserToken} from "../../../models/DTO/user-token";
import {ConfigService} from "../../../services/config/config.service";
import {WebsiteConfig} from "../../../models/config/website-config";
import {SHARED_IMPORTS} from "@shared";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {G2RadarModule} from "@delon/chart/radar";


@Component({
  selector: 'app-dashboard-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, NzAvatarModule, G2RadarModule]
})
export class DashboardWorkplaceComponent implements OnInit {
  notice: any[] = [];
  activities: any[] = [];
  radarData!: any[];
  loading = true;

  // region: mock data
  links = [
    {
      title: '个人主页',
      href: ''
    },
    {
      title: '笔记仓库',
      href: ''
    },
    {
      title: '文件仓库',
      href: ''
    },
    {
      title: '组织架构',
      href: ''
    },
    {
      title: '个人设置',
      href: ''
    },
    {
      title: '系统设置',
      href: ''
    }
  ];
  members = [
    {
      id: 'members-1',
      title: '科学搬砖组',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      link: ''
    },
    {
      id: 'members-2',
      title: '程序员日常',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      link: ''
    },
    {
      id: 'members-3',
      title: '设计天团',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      link: ''
    },
    {
      id: 'members-4',
      title: '中二少女团',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      link: ''
    },
    {
      id: 'members-5',
      title: '骗你学计算机',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      link: ''
    }
  ];

  // endregion

  constructor(private http: _HttpClient,
              public msg: NzMessageService,
              private cdr: ChangeDetectorRef,


              public router: Router,
              private configService: ConfigService,
              private authService: AuthService,
  ) {
    this.userToken = this.configService.GetUserToken();
    this.config = this.configService.GetWebSiteConfig();
  }

  userToken: UserToken;
  config?: WebsiteConfig;

  ngOnInit(): void {
    zip(this.http.get(this.config?.baseURL + '/api/chart'),
      this.http.get(this.config?.baseURL + '/api/notice'),
      this.http.get(this.config?.baseURL + '/api/activities')).subscribe(
      ([chart, notice, activities]: [any, any, any]) => {
        this.radarData = chart.radarData;
        this.notice = notice;
        this.activities = activities.map((item: any) => {
          item.template = item.template.toString().split(/@\{([^{}]*)\}/gi).map((key: string) => {
            if (item[key]) {
              return `<a>${item[key].name}</a>`;
            }
            return key;
          });
          return item;
        });
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }

  OnAllProject() {
    this.router.navigate(['/pro/account/center/projects'])
  }
}
