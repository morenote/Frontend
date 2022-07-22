import {Injectable, OnInit} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService{
  request!:IDBOpenDBRequest;
  constructor() { }

  getDb():IDBDatabase{
    return this.request.result;
  }
  open(dbName:string): Promise<void> {
    return new Promise<void>(resolve => {
      this.request = window.indexedDB.open(dbName);
      this.request.onsuccess=function (ev) {
        resolve();
      }
    })
  }
  createTable(tableName:string):Promise<void>{
    return  new Promise<void>(resolve => {
      this.request.result.createObjectStore(tableName);
      resolve();
    })
  }
  add(tableName:string, key:string,data:any){
    let result = this.getDb().transaction([tableName], 'readwrite')
      .objectStore(key)
      .add(data);
  }
}
