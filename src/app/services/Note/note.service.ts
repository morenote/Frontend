import {Injectable} from '@angular/core';
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
import {LocalForageService} from "../data-storage/local-forage.service";
import {ExtendedName} from "../../models/enum/extended-name";

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  userId: string;
  token: string;
  config: WebsiteConfig;
  sc: SecurityConfigDTO;

  constructor(public authService: AuthService,
              public http: HttpClient,
              public epass: EPass2001Service,
              public  localForageService:LocalForageService,
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

  public GetNoteContent(noteId: string): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Note/GetNoteContent';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('noteId', noteId);
    let result = this.http.get<ApiRep>(url, {params: httpParams});
    return result;
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
      let sc = this.configService.GetSecurityConfigDTOFromDB();
      //签名
      let signData = new SignData();
      let dataSign: DataSign = new DataSign();
      if (sc.ForceDigitalSignature) {
        signData.Id = "";
        signData.Data = noteId;
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/Note/UpdateNoteTitleAndContent";
        signData.SM3Data(noteId + noteTitle + content);
        dataSign = await this.epass.SendSignToePass2001(signData);
      }
      //数字信封
      let gm = new GMService();
      let sm4Key = gm.GetSM4Key();
      let iv = gm.GetIV();
      let digitalEnvelope = new DigitalEnvelope();
      let deJson = "";
      if (sc.ForceDigitalEnvelope) {
        digitalEnvelope.SetPayLodValue(content, sm4Key, this.sc.PublicKey!, iv);
        deJson = JSON.stringify(digitalEnvelope);
        LogUtil.log(deJson);
        content = "";
      }
      //更新笔记
      let url = this.config.baseURL + '/api/Note/UpdateNoteTitleAndContent';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('noteId', noteId);
      formData.set('noteTitle', noteTitle);
      formData.set('content', content);
      formData.set('dataSignJson', JSON.stringify(dataSign));
      formData.set('digitalEnvelopeJson', deJson);
      this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        LogUtil.log("数字信封：" + JSON.stringify(apiRe));

        if (apiRe.Encryption) {
          LogUtil.log("payLod.加密数据=" + apiRe.Data)
          LogUtil.log("payLod.解密.sm4Key=" + sm4Key)
          LogUtil.log("payLod.解密.iv=" + iv)
          let payLodJson = gm.SM4Dec(apiRe.Data, sm4Key, iv);
          LogUtil.log("payLodJson：" + JSON.stringify(payLodJson));
          let temp = JSON.parse(payLodJson) as PayLoadDTO;
          let payLod = new PayLoadDTO();
          payLod.Data = temp.Data;
          payLod.Hash = temp.Hash;
          apiRe.Data = payLod.Data;
          apiRe.Ok = payLod.VerifyPayLodHash();
          LogUtil.log("payLod.Data=" + temp.Data)
          LogUtil.log("Hash.Hash=" + temp.Hash)
        }
        LogUtil.log("解密结果：" + JSON.stringify(apiRe));

        resolve(apiRe);
      });

    })
  }

  public deleteNote(noteRepositoryId: string, noteId: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {

      //签名
      let signData = new SignData();
      let dataSign = new DataSign();
      if (this.sc.ForceDigitalSignature) {
        signData.Id = "";
        signData.Data = noteId;
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/Note/DeleteNote";

        dataSign = await this.epass.SendSignToePass2001(signData);

      }

      let url = this.config.baseURL + '/api/Note/DeleteNote';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('noteRepositoryId', noteRepositoryId);
      formData.set('noteId', noteId);
      formData.set('dataSignJson', JSON.stringify(dataSign));
      this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      });


    });

  }
}
