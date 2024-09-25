import { Injectable } from '@angular/core';
import {WebsiteConfig} from "../../models/config/website-config";
import {AuthService} from "../auth/auth.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRep} from "../../models/api/api-rep";
import {Observable} from "rxjs";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {SignData} from "../../models/DTO/USBKey/sign-data";
import {SecurityConfigDTO} from "../../models/DTO/Config/SecurityConfig/security-config-dto";
import {DataSign} from "../../models/DTO/USBKey/data-sign";

@Injectable({
  providedIn: 'root'
})
export class NoteCollectionService {
  userId: string ;
  token: string ;
  config: WebsiteConfig;
  sc: SecurityConfigDTO;

  constructor(public authService: AuthService,
              public http: HttpClient,
              public  epass:EPass2001Service,
              public configService: ConfigService) {


    let userToken=this.configService.GetUserToken();
    this.userId =userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
    this.sc = configService.GetSecurityConfigDTOFromDB();
  }
  public GetRootNoteCollection(notebookId: string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/NoteCollection/GetRootNoteCollection';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('notebookId', notebookId);
    let result = this.http.get<ApiRep>(url, {params:httpParams});
    return result;
  }
  public GetNoteCollectionChildren(notebookId: string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/NoteCollection/GetNoteCollectionChildren';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('notebookId', notebookId);
    let result = this.http.get<ApiRep>(url, {params:httpParams});
    return result;
  }
  public CreateNoteCollection(notebookId:string,noteCollectionTitle: string,parentNoteCollectionId:string) : Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      //签名
      let signData = new SignData();
      let dataSign = new DataSign();
      if (this.sc.ForceDigitalSignature){
        signData.Id = "";
        signData.Data = noteCollectionTitle;
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/NoteCollection/CreateNoteCollection";
        dataSign = await this.epass.SendSignToePass2001(signData);
      }
      //发送数据
      let url = this.config.baseURL + '/api/NoteCollection/CreateNoteBook';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('noteCollectionTitle', noteCollectionTitle);
      formData.set('notebookId', notebookId);
      formData.set('parentNoteCollectionId', parentNoteCollectionId);
      formData.set('dataSignJson', JSON.stringify(dataSign));
      this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      });
    })
  }
  public UpdateNoteCollectionTitle(noteCollectionId:string, noteCollectionTitle: string) : Promise<ApiRep> {
    return  new  Promise<ApiRep>(async resolve => {
      //签名
      let signData = new SignData();
      let dataSign = new DataSign();
      if (this.sc.ForceDigitalSignature){
        signData.Id = "";
        signData.Data = noteCollectionTitle;
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/NoteCollection/UpdateNoteCollectionTitle";
        signData.SM3Data(noteCollectionId+noteCollectionTitle)
        dataSign = await this.epass.SendSignToePass2001(signData);
      }
      //发送数据
      let url = this.config.baseURL + '/api/NoteCollection/UpdateNoteBookTitle';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('noteCollectionId', noteCollectionId);
      formData.set('noteCollectionTitle', noteCollectionTitle);
      formData.set('dataSignJson', JSON.stringify(dataSign));
       this.http.post<ApiRep>(url, formData).subscribe(apiRe=>{
        resolve(apiRe);
      })
    });

  }

  public deleteNoteCollection(notebookId: string, noteCollectionId: string, recursively:boolean, force:boolean): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {

      //签名
      let signData = new SignData();
      let dataSign=new DataSign();
      if (this.sc.ForceDigitalSignature){
        signData.Id = "";
        signData.Data = noteCollectionId;
        signData.UserId = this.userId;
        signData.UinxTime = Math.round(new Date().getTime() / 1000);
        signData.Operate = "/api/NoteCollection/DeleteNotebook";
        signData.SM3Data(notebookId + noteCollectionId)
        dataSign = await this.epass.SendSignToePass2001(signData);
      }
      let url = this.config.baseURL + '/api/NoteCollection/DeleteNoteCollection';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('notebookId', notebookId);
      formData.set('noteCollectionId', noteCollectionId);
      formData.set('recursively', recursively + "");
      formData.set('force', force + "");
      formData.set('dataSignJson', JSON.stringify(dataSign));

      this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      });

    })

  }
}
