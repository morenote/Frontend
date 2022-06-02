import {LoginSecurityPolicyLevel} from "./login-security-policy-level";

export class LoginSecurityPolicyLevelConvert {

  public  static toString(level:LoginSecurityPolicyLevel){
    switch (level) {
      case LoginSecurityPolicyLevel.unlimited:
        return " 无限制，可以使用单一因子认证登录"
      case LoginSecurityPolicyLevel.loose:
        return  " 宽松，在已经登录过并信任的设备上，允许使用单一因子登录"
      case LoginSecurityPolicyLevel.strict:
        return " 严格，必须使用口令+U2F、FIDO2、智能密码钥匙三种方式的任意一种方式"
      case LoginSecurityPolicyLevel.compliant:
        return  " 合规，必须使用口令+智能密码钥匙的双因素登录认证方式"
      default:
        return "未知";
    }
  }
}
