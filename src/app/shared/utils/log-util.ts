export class LogUtil {

  private  static  GetIsOk():boolean{
    return true;
  }
  private  static  isDebug():boolean{
   let log=localStorage.getItem("log");
   return log != null && log == "1";
  }


  public static  log(str:string){
    if (this.GetIsOk()){
      console.log(str)
    }
  }


  public  static  info(str:string){
    if (this.GetIsOk()){
      console.info(str)
    }
  }
  public  static  debug(str:string){
    if (this.GetIsOk()){
      console.debug(str)
    }
  }
  public  static  warning(str:string){
    if (this.GetIsOk()){
      console.warn(str)
    }
  }
  public  static  error(str:string){
    if (this.GetIsOk()){
      console.error(str)
    }
  }
}
