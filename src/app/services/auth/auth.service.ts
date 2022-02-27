import {Inject, Injectable} from '@angular/core';
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {LocalStorageDBService} from "../data-storage/local-storage-db.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    db:LocalStorageDBService
  public constructor(@Inject(DA_SERVICE_TOKEN) public tokenService: ITokenService,db:LocalStorageDBService) {
      this.db=db;
  }

  public SetUserName(name: string) {
    localStorage.setItem('userName', name);
  }
  public GetUserName(): string {
    let userName = localStorage.getItem('userName');
    if (userName == null) {
      return '';
    }
    return userName;
  }



  public SetToken(token:string):void{
    localStorage.setItem('token', token);
  }
  public GetToken():string{
    let token = localStorage.getItem('token');
    if (token == null) {
      return '';
    }
    return token;
  }

  public GetUserId():string | null{
    return  this.db.GetValue("UserId");
  }
  public SetUserId(value:string):void{
      this.db.SetValue("UserId",value);
  }
}
