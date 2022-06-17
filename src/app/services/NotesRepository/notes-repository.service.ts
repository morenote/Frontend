import {Injectable} from '@angular/core';
import {NotesRepository} from "../../models/entity/notes-repository";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRep} from "../../models/api/api-rep";
import {Observable} from "rxjs";
import {WebsiteConfig} from "../../models/config/website-config";

@Injectable({
  providedIn: 'root'
})
export class NotesRepositoryService {

  userId: string | null;
  token: string | null;
  config: WebsiteConfig;

  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {
    let userToken=this.configService.GetUserToken();
    this.userId =userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
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

  public CreateNoteRepository(notesRepository: NotesRepository): Observable<ApiRep> {
    let url = this.config.baseURL + '/api/NotesRepository/CreateNoteRepository';
    let fromData = new FormData()
    fromData.set('token', this.token!)
    fromData.set('data', JSON.stringify(notesRepository));
    let result = this.http.post<ApiRep>(url, fromData);
    return result;
  }

  public DeleteNoteRepository(noteRepositoryId: string) : Observable<ApiRep> {
    let url = this.config.baseURL + '/api/NotesRepository/DeleteNoteRepository';
    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('noteRepositoryId', noteRepositoryId);
    let result = this.http.delete<ApiRep>(url, {params:httpParams});
    return result;
  }



}
