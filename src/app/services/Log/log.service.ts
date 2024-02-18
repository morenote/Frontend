import { Injectable } from '@angular/core';
import {LogUtil} from "../../shared/utils/log-util";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  public  log(str:string):void{
    LogUtil.log(str);
  }
  public  info(str:string):void{
    LogUtil.info(str);
  }
  public  debug(str:string):void{
    LogUtil.debug(str);
  }
  public  error(str:string):void{
    LogUtil.error(str);
  }
}
