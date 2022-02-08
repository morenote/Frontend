import { Injectable } from '@angular/core';

import { WebsiteConfig } from '../../models/config/website-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public getWebSiteConfig(): WebsiteConfig {
    let config = new WebsiteConfig();
    config.baseURL = 'https://localhost:5001';
    return config;
  }
}
