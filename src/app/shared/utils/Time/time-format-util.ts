import {format} from "date-fns";

export class TimeFormatUtil {
  public  static  formatToString(date:Date,formatText:string):string{
    return format(date,formatText);
  }
  public  static  nowToString(formatText:string):string{
    return format(Date.now(),formatText);
  }
}
