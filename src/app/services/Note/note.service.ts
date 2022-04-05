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
export class NoteService {
  userId: string | null;
  token: string | null;
  config: WebsiteConfig;

  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {
    let userToken=this.authService.GetUserToken();
    this.userId =userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
  }

  public GetNotebookChildren(notebookId: string): Observable<ApiRep>  {
    let url = this.config.baseURL + '/api/Note/GetNotChildrenByNotebookId';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('notebookId', notebookId);
    let result = this.http.get<ApiRep>(url, {params:httpParams});
    return result;
  }

  public GetNoteContent(noteId: string): Observable<ApiRep>  {
    let url = this.config.baseURL + '/api/Note/GetNoteContent';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('noteId', noteId);
    let result = this.http.get<ApiRep>(url, {params:httpParams});
    return result;
  }

  public CreateNote(noteTitle: string,notebookId:string,isMarkdown:boolean) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Note/CreateNote';
    let formData = new FormData();
    formData.set('token', this.token!);
    formData.set('noteTitle', noteTitle);
    formData.set('notebookId', notebookId);
    formData.set('isMarkdown', isMarkdown+'');
    let result = this.http.post<ApiRep>(url, formData);
    return result;
  }
  public UpdateNoteTitle(noteId:string,noteTitle: string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Note/UpdateNoteTitle';
    let formData = new FormData();
    formData.set('token', this.token!);
    formData.set('noteId', noteId);
    formData.set('noteTitle', noteTitle);
    let result = this.http.post<ApiRep>(url, formData);
    return result;
  }
  public UpdateNoteTitleAndContent(noteId:string,noteTitle: string,content:string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/Note/UpdateNoteTitleAndContent';
    let formData = new FormData();
    formData.set('token', this.token!);
    formData.set('noteId', noteId);
    formData.set('noteTitle', noteTitle);
    formData.set('content', content);
    let result = this.http.post<ApiRep>(url, formData);
    return result;
  }



}
