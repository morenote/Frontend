export class SnowFlake {
  public  static  NextId():number{
    const UUID = require('uuid-int');
    const id = 0;
    const generator = UUID(id);
    const uuid = generator.uuid();
    return uuid;
  }
  public  static  NexHexId():string{

    let number=this.NextId() as Number;
    return number.toString(16);
  }

}
