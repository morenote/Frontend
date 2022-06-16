import { NeedVerificationCode } from "../need-verification-code";

export class SecurityConfigDTO {
  public PublicKey?:string;
  public OpenRegister?:boolean;
  public OpenDemo?:boolean;
  public ShareYourData?:boolean;
  public PasswordHashAlgorithm?:string;
  public ForceDigitalEnvelope?:boolean;
  public DigitalEnvelopeProtocol?:string;
  public NeedVerificationCode?:NeedVerificationCode;

}
