import {UserInfo} from "../../../models/entity/userInfo";
import {SecurityConfigDTO} from "../../../models/DTO/Config/SecurityConfig/security-config-dto";

/**
 * 生成口令应答报文
 */
export interface PasswordAnswering {
  /**
   * 生成口令应答报文
   * @param pwd 口令明文
   * @param user 用户信息
   * @param scDto 服务器安全设置
   * @constructor
   */
    TransferEncryptionIfUser(pwd:string, user:UserInfo, scDto:SecurityConfigDTO):Promise<string>;
}
