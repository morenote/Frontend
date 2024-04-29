import { inject, Inject, Injectable } from "@angular/core";
import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ALLOW_ANONYMOUS } from "@delon/auth";

@Injectable({
  providedIn: 'root'

})
export class HttpService {
  private httpClient: HttpClient=inject(HttpClient);
  constructor() { }

  /**
   *
   * @param url 请求地址
   * @param body fromdata
   * @param anonymous 是否允许匿名发送
   */
  public post<T>(url: string, body: any | null,anonymous:boolean=true):Observable<T>{
    let  httpContext=new HttpContext();
    if (ALLOW_ANONYMOUS){
      httpContext.set(ALLOW_ANONYMOUS,true)
    }
    if (body==null){
      return  this.httpClient.post<T>(url,{context:httpContext});
    }else {
      return  this.httpClient.post<T>(url,body,{context:httpContext});
    }
  }

  /**
   *
   * @param url
   * @param httpParams
   * @param anonymous
   */
  public get<T>(url:string,httpParams: HttpParams|null ,anonymous:boolean=true):Observable<T>{
    let  httpContext=new HttpContext();
    if (ALLOW_ANONYMOUS){
      httpContext.set(ALLOW_ANONYMOUS,true)
    }
    if (httpParams==null){
      return  this.httpClient.get<T>(url,{context:httpContext});
    }else {
      return  this.httpClient.get<T>(url,{params:httpParams,context:httpContext});
    }
  }
  public delete<T>(url:string,httpParams: HttpParams|null ,anonymous:boolean=true):Observable<T>{
    let  httpContext=new HttpContext();
    if (ALLOW_ANONYMOUS){
      httpContext.set(ALLOW_ANONYMOUS,true)
    }
    if (httpParams==null){
      return  this.httpClient.delete<T>(url,{context:httpContext});
    }else {
      return  this.httpClient.delete<T>(url,{params:httpParams,context:httpContext});
    }
  }

}
