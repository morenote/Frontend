import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageDBService {

  constructor() { }


  public SetValue(key:string, value:string):void{
    localStorage.setItem(key, value);

  }
  public GetValue(key:string):string | null{
    let value = localStorage.getItem(key);
    if (value == null) {
      return null;
    }
    return value;
  }
  public Remove(key:string){
    localStorage.removeItem(key);
  }
}
