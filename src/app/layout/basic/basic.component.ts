import {Component} from '@angular/core';
import {SettingsService, User} from '@delon/theme';
import {LayoutDefaultOptions} from '@delon/theme/layout-default';
import {environment} from '@env/environment';

@Component({
  selector: 'layout-basic',
  template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
      <layout-default-header-item direction="left">
        <!--github图标-->
        <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
          <i nz-icon nzType="github"></i>
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="left" hidden="mobile">
        <!--锁屏-->
        <a layout-default-header-item-trigger routerLink="/passport/lock">
          <i nz-icon nzType="lock"></i>
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="left" hidden="pc">
        <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
          <i nz-icon nzType="search"></i>
        </div>
      </layout-default-header-item>
      <layout-default-header-item direction="middle">
        <header-search class="alain-default__search" [(toggleChange)]="searchToggleStatus"></header-search>
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <header-notify></header-notify>
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <header-task></header-task>
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <header-icon></header-icon>
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click"
             nzPlacement="bottomRight">
          <i nz-icon nzType="setting"></i>
        </div>
        <!--设置按钮        -->
        <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
          <div nz-menu style="width: 200px;">
            <div nz-menu-item>
              <header-rtl></header-rtl>
            </div>
            <div nz-menu-item>
              <header-fullscreen></header-fullscreen>
            </div>
            <div nz-menu-item>
              <header-clear-storage></header-clear-storage>
            </div>
            <div nz-menu-item>
              <!-- 国际化-->
              <header-i18n></header-i18n>
            </div>
          </div>
        </nz-dropdown-menu>
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <!--用户头像        -->
        <header-user></header-user>
      </layout-default-header-item>
      <ng-template #asideUserTpl>
        <!-- 左侧用户头像       -->
        <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar"></nz-avatar>
          <div class="alain-default__aside-user-info">
            <strong>{{ user.name }}</strong>
            <p class="mb0">{{ user.email }}</p>
          </div>
        </div>
        <nz-dropdown-menu #userMenu="nzDropdownMenu">
          <ul nz-menu>
            <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
            <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>

          </ul>
        </nz-dropdown-menu>
      </ng-template>
      <ng-template #contentTpl>
        <router-outlet ></router-outlet>
      </ng-template>
    </layout-default>

    <setting-drawer *ngIf="showSettingDrawer"></setting-drawer>
    <theme-btn></theme-btn>
  `
})
export class LayoutBasicComponent {
  //是否隐藏侧边栏
  public isHideAside=false;
  searchToggleStatus = false;
  //是否显示主题设置按钮
  showSettingDrawer = !environment.production;

  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo-full.svg`,
    logoCollapsed: `./assets/logo.svg`,
    hideAside:this.isHideAside
  };

  onSetHideAside(isHideAside:boolean){
    console.log("setHideAside---log")
    this.options.hideAside=false;
  }
  ngOnInit(): void {
    console.log("LayoutBasicComponent is work")
  }
  get user(): User {
    return this.settings.user;
  }

  constructor(private settings: SettingsService) {
  }
}
