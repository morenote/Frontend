import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {OrganizationService} from "../../../../services/organization/organization.service";
import {OrganizationAuthorityEnum} from "../../../../models/enum/organization-authority-enum";
import {ApiRep} from "../../../../models/api/api-rep";
import {Organization} from "../../../../models/entity/organization";
import {AuthService} from "../../../../services/auth/auth.service";
import {Notebook} from "../../../../models/entity/notebook";
import {NotebookType} from "../../../../models/enum/notebook-type";
import {NotebookService} from "../../../../services/Note/notebook.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserToken} from "../../../../models/DTO/user-token";
import {ConfigService} from "../../../../services/config/config.service";
import {NotebookOwnerType} from "../../../../models/enum/notebook-owner-type";
import {NzMentionComponent} from "ng-zorro-antd/mention";
import {NzRadioGroupComponent} from "ng-zorro-antd/radio";
import {SharedModule} from "@shared";

@Component({
  selector: 'app-create-repository',
  templateUrl: './create-repository-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzMentionComponent,
    NzRadioGroupComponent,
    SharedModule
  ],
  standalone: true
})
export class CreateRepositoryFormComponent implements OnInit {
  form!: UntypedFormGroup;
  submitting = false;
  repositoryType:NotebookType=NotebookType.NoteRepository;
  orgs: Array<Organization> = new Array<Organization>();

  userToken?: UserToken;
  des="";
  value?: string;
  checked = true;


  ownerOptionArray: Array<string> = new Array<string>();
  ownerMap: Map<string, string> = new Map<string, string>();
  private visible: boolean = false;

  constructor(private fb: UntypedFormBuilder,
              private router: Router,
              private msg: NzMessageService,
              private cdr: ChangeDetectorRef,
              private orgService: OrganizationService,
              private authService: AuthService,
              private configService: ConfigService,
              public route: ActivatedRoute,
              private repositoryService: NotebookService
  ) {
    this.userToken = this.configService.GetUserToken();
  }

  ngOnInit(): void {

    let repositoryTypeString:number =Number( this.route.snapshot.queryParams["repositoryType"] );

    switch (repositoryTypeString){
      case 1:
        this.repositoryType=NotebookType.NoteRepository;
        this.msg.info("选择1");
        break;
      case 2:
        this.repositoryType=NotebookType.FileRepository;
        this.msg.info("选择2");
        break;
      default:
        this.repositoryType=NotebookType.NoteRepository;
        this.msg.info("选择default"+repositoryTypeString);
        break;
    }

    switch (this.repositoryType){
      case NotebookType.FileRepository:
        this.des="文件库用于托管文件和音视频，允许更多创作者参与到文件管理，可以站在更高的角度和更低的细粒度去融合创造力和想象力。";
        break;
      case NotebookType.NoteRepository:
        this.des="文档库用于托管文档和笔记，允许更多创作者参与到文档创作，可以站在更高的角度和更低的细粒度去融合创造力和想象力。";
        break;
    }
    this.msg.info(this.des);
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
      publicUsers: [null, []],
      VirtualFileBasePath: [null, []],
      VirtualFileAccessor: [null, []],
    });
    let userToken = this.configService.GetUserToken();
    let userName = userToken.Username;
    let userId = userToken.UserId;

    this.ownerOptionArray.push(userName);
    this.ownerMap.set(userName, userId!);
    this.orgService.GetOrganizationListByAuthorityEnum(OrganizationAuthorityEnum.AddRepository).subscribe((apiRe: ApiRep) => {

      if (apiRe.Ok == true) {
        this.orgs = apiRe.Data;
        for (const org of this.orgs) {
          this.ownerOptionArray.push(org.Name!);
          this.ownerMap.set(org.Name!, org.Id!);
        }
      }
    });

  }

  getNotesRepository(): Notebook {
    let repository = new Notebook();
    repository.Name = this.form.value.repositoryName;
    repository.NotebookType=this.repositoryType;

    if (this.form.value.owner == this.userToken?.Username) {
      repository.OwnerId = this.userToken?.UserId!;
      repository.NotebookOwnerType = NotebookOwnerType.Personal;
    } else {
      repository.NotebookOwnerType = NotebookOwnerType.Organization;
      repository.OwnerId = this.ownerMap.get(this.form.value.owner!);
    }
    repository.Description = this.form.value.description;
    repository.License = this.form.value.selectedLicense!;
    repository.Visible = this.form.value.public==3;
    repository.Avatar="/images/avatar/antd.png";

    repository.VirtualFileBasePath=this.form.value.VirtualFileBasePath;//虚拟文件基础路径
    repository.VirtualFileAccessor=this.form.value.VirtualFileAccessor;//虚拟文件访问器
    return repository;

  }

  async submit() {
    this.submitting = true;
    let repository = this.getNotesRepository();
    let apiRe = await this.repositoryService.CreateNotebook(repository);
    this.submitting = false;
    this.cdr.detectChanges();
    if (apiRe.Ok == true) {
      let result: Notebook = apiRe.Data;
      this.msg.success(`创建成功:` + result.Id);
      setTimeout(() => {
        this.router.navigateByUrl("/pro/account/center/documents");
      }, 500);
    } else {
      this.msg.error(`创建失败:` + apiRe.Msg);
    }

  }

  //-----------------------
  inputValue: string = '';
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];

  repositoryPath: any;
  selectedVisible = '1';

  onChange(value: string): void {
    console.log(value);
  }

  onSelect(suggestion: string): void {
    console.log(`onSelect ${suggestion}`);
  }

  OnRepositoryNameChange(value: string) {
    this.repositoryPath = value;
  }

  OnVisibleChange(value: string) {
    console.log("可见性发生改变=" + this.selectedVisible + "--" + value);
    if (this.value == '2') {
      this.visible = true;
    }
  }

}
