import {ClientMessageType} from "./message-type";

export class ClientMessage {
  public  MessageType?:ClientMessageType;//消息类型 challenge和sign
  public  Ok?:boolean;//作为返回消息时，表示是否成功
  public  Data?:any;//数据
}
