import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

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
}
