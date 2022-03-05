export class UserLoginSecurityStrategy {
  public UserId: string | undefined;
  public UserName: string | undefined;

  public EnhancedValidationRequired: boolean | undefined;

  public AllowPassWordLogin: boolean | undefined;

  public AllowFIDO2Login: boolean | undefined;
  public AllowUSBKeyLogin: boolean | undefined;
  public AllowQRCodeLogin: boolean | undefined;

  public EVGoogle2StepAuthentication: boolean | undefined;
  public EVFace: boolean | undefined;
  public EVEmailCode: boolean | undefined;
  public EVSMCode: boolean | undefined;
}
