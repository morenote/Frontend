export class LogUtil {

  private  static  GetIsOk(){
    return true;
  }
  public static  log(str:string){
    if (this.GetIsOk()){
      console.log(str)
    }
  }
  public  static  warning(str:string){
    if (this.GetIsOk()){
      console.log(str)
    }
  }

}
