import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {OrganizationService} from "../../../../services/organization/organization.service";
import {OrganizationAuthorityEnum} from "../../../../models/enum/organization-authority-enum";
import {ApiRep} from "../../../../models/api/api-rep";
import {Organization} from "../../../../models/entity/organization";
import {AuthService} from "../../../../services/auth/auth.service";
import {NotesRepository} from "../../../../models/entity/notes-repository";
import {RepositoryType} from "../../../../models/enum/repository-type";
import {NotesRepositoryService} from "../../../../services/NotesRepository/notes-repository.service";
import {Router} from "@angular/router";
import {UserToken} from "../../../../models/DTO/user-token";
import {ConfigService} from "../../../../services/config/config.service";

@Component({
  selector: 'app-create-repository',
  templateUrl: './create-repository-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRepositoryFormComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  orgs:Array<Organization>=new Array<Organization>();

   userToken?:UserToken;

  value?: string;
  checked = true;



  ownerOptionArray:Array<string>=new Array<string>();
  ownerMap:Map<string,string>=new Map<string, string>();
  private visible: boolean=false;
  constructor(private fb: FormBuilder,
              private router: Router,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef,
              private orgService:OrganizationService,
              private authService:AuthService,
              private configService:ConfigService,
              private notesRepositoryService:NotesRepositoryService
              ) {
    this.userToken=this.configService.GetUserToken();
  }

  ngOnInit(): void {
    this.form = this.fb.group({

      repositoryName: [null, []],
      path: [null, [Validators.required]],
      owner: [null, [Validators.required]],
      description: [null, []],
      selectedRepositoryTemplate: [null, []],
      selectedLicense: [null, []],
      suggestions: [null, []],


      client: [null, []],
      invites: [null, []],
      weight: [null, []],
      public: [1, [Validators.min(1), Validators.max(3)]],
      publicUsers: [null, []]
    });
    let userToken=this.configService.GetUserToken();
    let userName=userToken.Username;
    let userId=userToken.UserId;

    this.ownerOptionArray.push(userName);
    this.ownerMap.set(userName,userId!);
    this.orgService.GetOrganizationListByAuthorityEnum(OrganizationAuthorityEnum.AddRepository).subscribe((apiRe:ApiRep)=>{

      if (apiRe.Ok == true) {
        this.orgs = apiRe.Data;
        for (const org of this.orgs) {
          this.ownerOptionArray.push(org.Name!);
          this.ownerMap.set(org.Name!,org.Id!);
        }
      }
    });

  }
  getNotesRepository():NotesRepository{
    let repository=new NotesRepository();
    repository.Name=this.form.value.repositoryName;



    if (this.form.value.owner==this.userToken?.Username){
      repository.OwnerId=this.userToken?.UserId!;
      repository.RepositoryOwnerType=RepositoryType.Personal;
    }else {
      repository.RepositoryOwnerType=RepositoryType.Organization;
      repository.OwnerId=this.ownerMap.get(this.form.value.owner!);
    }
    repository.Description=this.form.value.description;
    repository.License=this.form.value.selectedLicense!;
    repository.Visible=this.form.value.visible;
    return repository;

  }

  async submit() {
    this.submitting = true;
    let notesRepository = this.getNotesRepository();
    let apiRe = await this.notesRepositoryService.CreateNoteRepository(notesRepository);
    this.submitting = false;
    this.cdr.detectChanges();
    if (apiRe.Ok == true) {
      let result: NotesRepository = apiRe.Data;
      this.msg.success(`????????????:` + result.Id);
      setTimeout(() => {
        this.router.navigateByUrl("/pro/account/center/documents");
      }, 500);
    } else {
      this.msg.error(`????????????:` + apiRe.Msg);
    }

  }

  //-----------------------
  inputValue: string = '';
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '??????', '????????????'];

  repositoryPath: any;
  selectedVisible='1';

  onChange(value: string): void {
    console.log(value);
  }

  onSelect(suggestion: string): void {
    console.log(`onSelect ${suggestion}`);
  }

  OnRepositoryNameChange(value:string) {
   this.repositoryPath=value;
  }

  OnVisibleChange(value: string) {
    console.log("?????????????????????="+this.selectedVisible+"--"+value);
    if (this.value=='2'){
      this.visible=true;
    }
  }

}
