import {inject, Injectable} from '@angular/core';
import {WebsiteConfig} from "../../models/config/website-config";
import {AuthService} from "../auth/auth.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRep} from "../../models/api/api-rep";
import {Observable} from "rxjs";
import {SignData} from "../../models/DTO/USBKey/sign-data";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {GMService} from "../Cryptography/GM/gm.service";
import {DigitalEnvelope} from "../../models/DTO/Api/digital-envelope";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {LogUtil} from "../../shared/utils/log-util";
import {PayLoadDTO} from "../../models/DTO/Api/pay-load-d-t-o";
import {DataSign} from "../../models/DTO/USBKey/data-sign";

import {ExtendedName} from "../../models/enum/extended-name";
import {TelegramFacService} from "../Communication/telegram-fac.service";
import {resolve} from "@angular/compiler-cli";

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  userId: string;
  token: string;
  config: WebsiteConfig;
  sc: SecurityConfigDTO;
  telegramFacService:TelegramFacService=inject(TelegramFacService);

  constructor(public authService: AuthService,
              public http: HttpClient,
              public epass: EPass2001Service,

              public configService: ConfigService) {
    let userToken = this.configService.GetUserToken();
    this.userId = userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
    this.sc = configService.GetSecurityConfigDTOFromDB();
  }

  public GetNotebookChildren(notebookId: string): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Note/GetNotChildrenByNotebookId';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('notebookId', notebookId);
    let result = this.http.get<ApiRep>(url, {params: httpParams});
    return result;
  }

  public  GetNoteContent(noteId: string): Promise<ApiRep> {

    //更新笔记
    return new Promise<ApiRep>(async  (resolve) => {
      let tel = this.telegramFacService.Instace();
      tel = tel.setURL("/api/Note/GetNoteContent");
      let map = new Map<string, string>();


      map.set('token', this.token!);
      map.set('noteId', noteId);

      tel = tel.setData(map);

      if (this.sc.ForceDigitalSignature) {
        tel = await tel.addSign("noteId")
        tel = tel.addDigitalEnvelope("noteId")
      }
      let apiRe = await tel.post();
      resolve(apiRe);
    })
  }

  public CreateNote(noteTitle: string, notebookId: string, extendedName: ExtendedName): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      //CreateNote
      let url = this.config.baseURL + '/api/Note/CreateNote';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('noteTitle', noteTitle);
      formData.set('notebookId', notebookId);
      formData.set('extendedName', extendedName.toString() );

      let result = this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      });


    })

  }

  public UpdateNoteTitle(noteId: string, noteTitle: string): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Note/UpdateNoteTitle';
    let formData = new FormData();
    formData.set('token', this.token!);
    formData.set('noteId', noteId);
    formData.set('noteTitle', noteTitle);
    let result = this.http.post<ApiRep>(url, formData);
    return result;
  }

  public UpdateNoteTitleAndContent(noteId: string, noteTitle: string, content: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      //更新笔记
      let url = '/api/Note/UpdateNoteTitleAndContent';

      let tel=this.telegramFacService.Instace();
      tel=tel.setURL(url);
      let map=new Map<string,string>();


      map.set('token', this.token!);
      map.set('noteId', noteId);
      map.set('noteTitle', noteTitle);
      map.set('content', content)
      tel=tel.setData(map);

      if (this.sc.ForceDigitalSignature){
        tel=await tel.addSign("content")
        tel=tel.addDigitalEnvelope("content")
      }
      let apiRe= await tel.post();
      resolve(apiRe);

    })
  }

  public deleteNote(noteRepositoryId: string, noteId: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {


      let url =  '/api/Note/DeleteNote';
      let tel=this.telegramFacService.Instace();
      tel=tel.setURL(url);
      let map=new Map<string,string>();


      map.set('token', this.token!);
      map.set('noteRepositoryId', noteRepositoryId);
      map.set('noteId', noteId);
      tel.setData(map);
      if (this.sc.ForceDigitalSignature){
        tel=await tel.addSign("noteId")
        //tel=tel.addDigitalEnvelope("noteId")
      }
      let apiRe= await tel.post();
      resolve(apiRe);


    });

  }
}
