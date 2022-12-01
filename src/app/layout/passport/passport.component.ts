import { Component, Inject, OnInit } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less']
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
