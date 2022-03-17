import {Injectable} from '@angular/core';
import {NotesRepository} from "../../models/entity/notes-repository";
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ConfigService} from "../config/config.service";
import {ApiRe} from "../../models/api/api-re";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotesRepositoryService {


  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {
  }


  /**
   *  获得我的笔记仓库列表
   * @constructor
   */
  public GetMyNoteRepository(): Observable<ApiRe> {
    let userId = this.authService.GetUserId();
    let token = this.authService.GetToken();
    let config = this.configService.GetWebSiteConfig();
    let url = config.baseURL + '/api/NotesRepository/GetMyNoteRepository';
    let queryParams = new HttpParams().append('userId',userId!).append('token',token);
    let result = this.http.get<ApiRe>(url,{params:queryParams});
    return result;
  }


}
