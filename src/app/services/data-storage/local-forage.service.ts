import {Injectable} from '@angular/core';
import * as localforage from "localforage";

@Injectable({
  providedIn: 'root'
})
export class LocalForageService {
  my_localforage: LocalForage | null
  public getItem<T>(key: string):Promise<T | null> | undefined{
    return this.my_localforage?.getItem(key);
  }
  public  setItem<T>(key: string, value: T):Promise<T> | undefined {
      return   this.my_localforage?.setItem(key,value);
  }
  constructor() {
    let dateBaseName="default";
    this.my_localforage=localforage.createInstance({
      name: dateBaseName
    });
    this.my_localforage.config({
      driver      : localforage.WEBSQL, // 使用 WebSQL；也可以使用 setDriver()
      name        : dateBaseName,
      version     : 1.0,
      size        : 1024*1024*1024, // 数据库的大小，单位为字节。现仅 WebSQL 可用
      storeName   : 'keyvaluepairs', // 仅接受字母，数字和下划线
      description : 'some description'
    });
  }
}
