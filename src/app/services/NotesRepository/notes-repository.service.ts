import {Injectable} from '@angular/core';
import {NotesRepository} from "../../models/entity/notes-repository";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRep} from "../../models/api/api-rep";
import {Observable} from "rxjs";
import {WebsiteConfig} from "../../models/config/website-config";
import {SignData} from "../../models/DTO/USBKey/sign-data";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {DataSign} from "../../models/DTO/USBKey/data-sign";

@Injectable({
  providedIn: 'root'
})
export class NotesRepositoryService {

  userId: string;
  token: string;
  config: WebsiteConfig;
  sc: SecurityConfigDTO;

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


  /**
   *  获得我的笔记仓库列表
   * @constructor
   */
  public GetMyNoteRepository(): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/NotesRepository/GetMyNoteRepository';
    let queryParams = new HttpParams()
      .append('userId', (this.userId)!)
      .append('token', this.token!);
    let result = this.http.get<ApiRep>(url, {params: queryParams});
    return result;
  }

  public CreateNoteRepository(notesRepository: NotesRepository): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {


      let signData = new SignData();
      let dataSign=new DataSign();
      if (this.sc.ForceDigitalSignature){
        signData.Id = "";
        signData.Data = JSON.stringify(notesRepository);
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/NotesRepository/CreateNoteRepository";
        dataSign = await this.epass.SendSignToePass2001(signData);
      }

      let url = this.config.baseURL + '/api/NotesRepository/CreateNoteRepository';
      let fromData = new FormData()
      fromData.set('token', this.token!)
      fromData.set('data', JSON.stringify(notesRepository));
      fromData.set('dataSignJson', JSON.stringify(dataSign));
      let result = this.http.post<ApiRep>(url, fromData).subscribe(apiRe => {
        resolve(apiRe);
      })


    });

  }

  public DeleteNoteRepository(noteRepositoryId: string): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      let signData = new SignData();
      let dataSign = new DataSign();

      if (this.sc.ForceDigitalSignature) {
        signData.Id = "";
        signData.Data = noteRepositoryId;
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/NotesRepository/DeleteNoteRepository";

        dataSign = await this.epass.SendSignToePass2001(signData);
      }


      let url = this.config.baseURL + '/api/NotesRepository/DeleteNoteRepository';
      let fromData = new FormData();
      fromData.set('token', this.token!)
      fromData.set('noteRepositoryId', noteRepositoryId);
      fromData.set('dataSignJson', JSON.stringify(dataSign));
      let result = this.http.post<ApiRep>(url, fromData).subscribe(apiRe => {
        resolve(apiRe);
      });


    })

  }


}
