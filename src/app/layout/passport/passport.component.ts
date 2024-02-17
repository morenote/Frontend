import { Component, Inject, OnInit } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import {RouterOutlet} from "@angular/router";
import {HeaderI18nComponent} from "../basic/widgets/i18n.component";
import {GlobalFooterModule} from "@delon/abc/global-footer";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ThemeBtnComponent} from "@delon/theme/theme-btn";

@Component({
  imports: [RouterOutlet, HeaderI18nComponent, GlobalFooterModule, NzIconModule, ThemeBtnComponent],
  selector: 'layout-passport',
  standalone: true,
  styleUrls: ['./passport.component.less'],
  templateUrl: './passport.component.html'
})
export class LayoutPassportComponent implements OnInit {
  links = [
    {
      title: 'Wiki',
      href: 'https://github.com/morenote/Server/wiki'
    },
    {
      title: 'Blog',
      href: 'https://www.morenote.top/blog/14e884a2fc021000/Index'
    },
    {
      title: 'Issues',
      href: 'https://github.com/morenote/Server/issues'
    }
  ];

  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {}

  ngOnInit(): void {
    this.tokenService.clear();
  }
}
