import { Injectable } from '@angular/core';
import {WebsiteConfig} from "../../models/config/website-config";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRep} from "../../models/api/api-rep";
import {Observable} from "rxjs";
import {EPass2001Service} from "../Usbkey/EnterSafe/ePass2001/e-pass2001.service";
import {SignData} from "../../models/DTO/USBKey/sign-data";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {
  userId: string ;
  token: string ;
  config: WebsiteConfig;

  constructor(public authService: AuthService,
              public http: HttpClient,
              public  epass:EPass2001Service,
              public configService: ConfigService) {


    let userToken=this.configService.GetUserToken();
    this.userId =userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
  }
  public GetRootNotebooks(noteRepositoryId: string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Notebook/GetRootNotebooks';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('repositoryId', noteRepositoryId);
    let result = this.http.get<ApiRep>(url, {params:httpParams});
    return result;
  }
  public GetNotebookChildren(notebookId: string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Notebook/GetNotebookChildren';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('notebookId', notebookId);
    let result = this.http.get<ApiRep>(url, {params:httpParams});
    return result;
  }
  public CreateNoteBook(noteRepositoryId:string,notebookTitle: string,parentNotebookId:string) : Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {
      //签名
      let signData = new SignData();
      signData.Id = "";
      signData.Data = notebookTitle;
      signData.UserId = this.userId;
      signData.UinxTime = Math.round(new Date().getTime() / 1000);
      signData.Operate = "/api/Notebook/CreateNoteBook";
      let dataSign = await this.epass.SendSignToePass2001(signData);
      //发送数据
      let url = this.config.baseURL + '/api/Notebook/CreateNoteBook';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('notebookTitle', notebookTitle);
      formData.set('noteRepositoryId', noteRepositoryId);
      formData.set('parentNotebookId', parentNotebookId);
      formData.set('dataSignJson', JSON.stringify(dataSign));
      this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      });
    })
  }
  public UpdateNoteBookTitle(notebookId:string,notebookTitle: string) : Promise<ApiRep> {
    return  new  Promise<ApiRep>(async resolve => {
      //签名
      let signData = new SignData();
      signData.Id = "";
      signData.Data = notebookTitle;
      signData.UserId = this.userId;
      signData.UinxTime = Math.round(new Date().getTime() / 1000);
      signData.Operate = "/api/Notebook/UpdateNoteBookTitle";
      signData.SM3Data(notebookId+notebookTitle)
      let dataSign = await this.epass.SendSignToePass2001(signData);
      //发送数据
      let url = this.config.baseURL + '/api/Notebook/UpdateNoteBookTitle';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('notebookId', notebookId);
      formData.set('notebookTitle', notebookTitle);
      formData.set('dataSignJson', JSON.stringify(dataSign));
       this.http.post<ApiRep>(url, formData).subscribe(apiRe=>{
        resolve(apiRe);
      })
    });

  }

  public deleteNotebook(noteRepositoryId: string,notebookId: string,recursively:boolean,force:boolean): Promise<ApiRep> {
    return new Promise<ApiRep>(async resolve => {

      let signData = new SignData();
      signData.Id = "";
      signData.Data = notebookId;
      signData.UserId = this.userId;
      signData.UinxTime = Math.round(new Date().getTime() / 1000);
      signData.Operate = "/api/Notebook/DeleteNotebook";
      signData.SM3Data(noteRepositoryId + notebookId)
      let dataSign = await this.epass.SendSignToePass2001(signData);


      let url = this.config.baseURL + '/api/Notebook/DeleteNotebook';
      let formData = new FormData();
      formData.set('token', this.token!);
      formData.set('noteRepositoryId', noteRepositoryId);
      formData.set('notebookId', notebookId);
      formData.set('recursively', recursively + "");
      formData.set('force', force + "");
      formData.set('dataSignJson', JSON.stringify(dataSign));

      this.http.post<ApiRep>(url, formData).subscribe(apiRe => {
        resolve(apiRe);
      });

    })

  }
}
