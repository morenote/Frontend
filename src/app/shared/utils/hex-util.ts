export class HexUtil {

  public static  ByteArrayToHex(bytes:any):string{
    let hex="",len=bytes.length;
    for(let i=0;i<len;i++){
      let tmp,num=bytes[i];
      if(num<0){
        tmp=(255+num+1).toString(16);
      }else{
        tmp=num.toString(16);
      }
      if(tmp.length==1){
        return "0"+tmp;
      }
      hex+=tmp;
    }
    return hex
  }
  public  hexToBase64(str:any){
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
  }
  public  static  hexToBase64(hexstring:any) {
    return btoa(hexstring.match(/\w{2}/g).map((a:any)=> {
      return String.fromCharCode(parseInt(a, 16));
    }).join(""));
  }

  public  static  base64ToHex(str:any) {
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
      var tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = "0" + tmp;
      hex[hex.length] = tmp;
    }
    return hex.join(" ");
  }
}
