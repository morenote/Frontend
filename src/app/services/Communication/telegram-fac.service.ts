import { inject, Injectable } from "@angular/core";
import { ConfigService } from "../config/config.service";
import { EPass2001Service } from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import { HttpClient } from "@angular/common/http";
import { TelegramService } from "./telegram.service";

@Injectable({
  providedIn: 'root'
})
export class TelegramFacService {
  public configService: ConfigService=inject(ConfigService);
  public ePass2001Service:EPass2001Service=inject(EPass2001Service);
  public http: HttpClient=inject(HttpClient);
  constructor() { }
  public  Instace():TelegramService{
    return new TelegramService(this.configService,this.ePass2001Service,this.http);
  }
}
