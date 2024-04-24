import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ALLOW_ANONYMOUS } from "@delon/auth";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  http: HttpClient=Inject(HttpClient);
  constructor() { }
  public post<T>(url: string, body: any | null,anonymous:boolean):Observable<T>{
    let  httpContext=new HttpContext();
    if (ALLOW_ANONYMOUS){
      httpContext.set(ALLOW_ANONYMOUS,true)
    }
    if (body==null){
      return  this.http.post<T>(url,{context:httpContext});
    }else {
      return  this.http.post<T>(url,body,{context:httpContext});
    }
  }

  /**
   *
   * @param url
   * @param httpParams
   * @param anonymous
   */
  public get<T>(url:string,httpParams: HttpParams|null ,anonymous:boolean):Observable<T>{
    let  httpContext=new HttpContext();
    if (ALLOW_ANONYMOUS){
      httpContext.set(ALLOW_ANONYMOUS,true)
    }
    if (httpParams==null){
      return  this.http.get<T>(url,{context:httpContext});
    }else {
      return  this.http.get<T>(url,{params:httpParams,context:httpContext});
    }
  }
  public delete<T>(url:string,httpParams: HttpParams|null ,anonymous:boolean):Observable<T>{
    let  httpContext=new HttpContext();
    if (ALLOW_ANONYMOUS){
      httpContext.set(ALLOW_ANONYMOUS,true)
    }
    if (httpParams==null){
      return  this.http.delete<T>(url,{context:httpContext});
    }else {
      return  this.http.delete<T>(url,{params:httpParams,context:httpContext});
    }
  }

}
