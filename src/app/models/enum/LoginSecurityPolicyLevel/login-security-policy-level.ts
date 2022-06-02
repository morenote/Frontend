/**
 * 登录安全策略级别
 */
export enum LoginSecurityPolicyLevel {
  //U2F=人脸、谷歌动态令牌、安全问题、短信验证码、邮箱验证码
  //密码设备=FIDO2、安全令牌

  unlimited=0,//无限制，可以使用单一因子登录
  loose =1,//宽松，在已经登录过并信任的设备上，允许使用单一因子登录
  strict =2,//严格，必须使用口令+U2F、FIDO2、智能密码钥匙三种方式的任意一种方式
  compliant= 3//合规，必须使用口令+智能密码钥匙的组合


}
