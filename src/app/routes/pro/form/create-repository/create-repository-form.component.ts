import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {OrganizationService} from "../../../../services/organization/organization.service";
import {OrganizationAuthorityEnum} from "../../../../models/enum/organization-authority-enum";
import {ApiRep} from "../../../../models/api/api-rep";
import {Organization} from "../../../../models/entity/organization";
import {AuthService} from "../../../../services/auth/auth.service";

@Component({
  selector: 'app-create-repository',
  templateUrl: './create-repository-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRepositoryFormComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  selectedOwner = null;
  selectedLicense = null;
  selectedRepositoryTemplate = null;
  value?: string;
  checked = true;

  ownerOptionArray:Array<string>=new Array<string>();

  constructor(private fb: FormBuilder,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef,
              private orgService:OrganizationService,
              private authService:AuthService
              ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      owner: [null, [Validators.required]],
      path: [null, [Validators.required]],
      goal: [null, []],

      client: [null, []],
      invites: [null, []],
      weight: [null, []],
      public: [1, [Validators.min(1), Validators.max(3)]],
      publicUsers: [null, []]
    });
    let userName=this.authService.GetUserName();

    this.ownerOptionArray.push(userName);
    this.orgService.GetOrganizationListByAuthorityEnum(OrganizationAuthorityEnum.AddRepository).subscribe((apiRe:ApiRep)=>{
      if (apiRe.Ok==true){
        let orgs:Array<Organization>=apiRe.Data;
        for (const org of orgs) {
          this.ownerOptionArray.push(org.Name!);
        }
      }

    });

  }

  submit(): void {
    this.submitting = true;


    setTimeout(() => {
      this.submitting = false;
      this.msg.success(`提交成功`);
      this.cdr.detectChanges();
    }, 500);
  }

  //-----------------------
  inputValue: string = '';
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];
  repositoryName: any;
  repositoryPath: any;

  onChange(value: string): void {
    console.log(value);
  }

  onSelect(suggestion: string): void {
    console.log(`onSelect ${suggestion}`);
  }

  OnRepositoryNameChange() {
    this.repositoryPath = this.repositoryName;
  }
}
