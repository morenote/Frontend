import { Injectable } from '@angular/core';
import {WebsiteConfig} from "../../models/config/website-config";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRep} from "../../models/api/api-rep";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotebookService {
  userId: string | null;
  token: string | null;
  config: WebsiteConfig;

  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {


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
  public CreateNoteBook(noteRepositoryId:string,notebookTitle: string,parentNotebookId:string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Notebook/CreateNoteBook';
    let formData = new FormData();
    formData.set('token', this.token!);
    formData.set('notebookTitle', notebookTitle);
    formData.set('noteRepositoryId', noteRepositoryId);
    formData.set('parentNotebookId', parentNotebookId);
    let result = this.http.post<ApiRep>(url, formData);
    return result;
  }
  public UpdateNoteBookTitle(notebookId:string,notebookTitle: string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Notebook/UpdateNoteBookTitle';
    let formData = new FormData();
    formData.set('token', this.token!);
    formData.set('notebookId', notebookId);
    formData.set('notebookTitle', notebookTitle);
    let result = this.http.post<ApiRep>(url, formData);
    return result;
  }

  public deleteNotebook(noteRepositoryId: string,notebookId: string,recursively:boolean,force:boolean): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Notebook/DeleteNotebook';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('noteRepositoryId', noteRepositoryId)
      .append('notebookId', notebookId)
      .append('recursively', recursively)
      .append('force', force);
    let result = this.http.delete<ApiRep>(url, {params: httpParams});
    return result;
  }
}
