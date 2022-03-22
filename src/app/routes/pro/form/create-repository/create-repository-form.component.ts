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

@Component({
  selector: 'app-create-repository',
  templateUrl: './create-repository-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRepositoryFormComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  orgs:Array<Organization>=new Array<Organization>();



  value?: string;
  checked = true;



  ownerOptionArray:Array<string>=new Array<string>();
  ownerMap:Map<string,string>=new Map<string, string>();
  private visible: boolean=false;
  constructor(private fb: FormBuilder,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef,
              private orgService:OrganizationService,
              private authService:AuthService,
              private notesRepositoryService:NotesRepositoryService
              ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({

      owner: [null, [Validators.required]],
      path: [null, [Validators.required]],
      description: [null, []],
      repositoryName: [null, []],
      selectedRepositoryTemplate: [null, []],
      selectedLicense: [null, []],
      suggestions: [null, []],


      client: [null, []],
      invites: [null, []],
      weight: [null, []],
      public: [1, [Validators.min(1), Validators.max(3)]],
      publicUsers: [null, []]
    });
    let userName=this.authService.GetUserName();
    let userId=this.authService.GetUserId();

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

    if (this.form.value.owner==this.authService.GetUserName()){
      repository.OwnerId=this.authService.GetUserId()!;
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

  submit(): void {
    this.submitting = true;
    let notesRepository=this.getNotesRepository();
    this.notesRepositoryService.CreateNoteRepository(notesRepository).subscribe((apiRe:ApiRep)=>{
      this.submitting = false;
      this.cdr.detectChanges();
      if (apiRe.Ok==true){
        let result:NotesRepository=apiRe.Data;
        this.msg.success(`创建成功:`+result.Id);
      }else {
        this.msg.error(`创建失败:`+apiRe.Msg);
      }

    })


  }

  //-----------------------
  inputValue: string = '';
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];

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
    console.log("可见性发生改变="+this.selectedVisible+"--"+value);
    if (this.value=='2'){
      this.visible=true;
    }

  }
}
