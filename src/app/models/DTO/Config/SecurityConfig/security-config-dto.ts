import { NeedVerificationCode } from "../need-verification-code";
import { DigitalEnvelopeProtocol } from "./digital-envelope-protocol";
import {DigitalSignatureProtocol} from "./digital-signature-protocol";

export class SecurityConfigDTO {
  public PublicKey?:string;
  public OpenRegister?:boolean;
  public OpenDemo?:boolean;
  public ShareYourData?:boolean;
  public PasswordHashAlgorithm?:string;
  public ForceDigitalEnvelope?:boolean;
  public ForceDigitalEnvelopeProtocol?:DigitalEnvelopeProtocol;

  public  ForceDigitalSignature?:boolean;
  public  ForceDigitalSignatureProtocol?:DigitalSignatureProtocol;

  public NeedVerificationCode?:NeedVerificationCode;

}
