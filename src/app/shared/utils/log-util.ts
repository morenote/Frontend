export class LogUtil {

  private  static  GetIsOk():boolean{
    return true;
  }
  public static  log(str:string){
    if (this.GetIsOk()){
      console.log(str)
    }
  }


  public  static  info(str:string){
    if (this.GetIsOk()){
      console.log(str)
    }
  }
  public  static  debug(str:string){
    if (this.GetIsOk()){
      console.log(str)
    }
  }
  public  static  warning(str:string){
    if (this.GetIsOk()){
      console.log(str)
    }
  }
  public  static  error(str:string){
    if (this.GetIsOk()){
      console.log(str)
    }
  }
}
