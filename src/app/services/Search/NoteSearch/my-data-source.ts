import {BehaviorSubject, Observable, of, Subject, takeUntil} from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {catchError} from "rxjs/operators";
import {WebsiteConfig} from "../../../models/config/website-config";
import {AuthService} from "../../auth/auth.service";
import {ConfigService} from "../../config/config.service";
import {Injectable} from "@angular/core";

interface ItemData {
  gender: string;
  NoteId: string;
  Title: string;
}


@Injectable({
  providedIn: 'root'
})
export class MyDataSource extends DataSource<ItemData> {

  userId: string | null;
  token: string | null;
  config: WebsiteConfig;

  public noteRepositoryId!:string;
  public key!:string;




  private pageSize = 10;
  private cachedData: ItemData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();


  constructor(public authService: AuthService, public http: HttpClient, public configService: ConfigService) {
    super();
    let userToken = this.configService.GetUserToken();
    this.userId = userToken.UserId;
    this.token = userToken.Token;
    this.config = this.configService.GetWebSiteConfig();
  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(0);
    collectionViewer.viewChange.pipe(takeUntil(this.complete$), takeUntil(this.disconnect$)).subscribe(range => {
      if (this.cachedData.length >= 50) {
        this.complete$.next();
        this.complete$.complete();
      } else {
        const endPage = this.getPageForIndex(range.end);
        this.fetchPage(endPage + 1);
      }
    });
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  public update(page:number):void{

    let url = this.config.baseURL + '/api/Note/SearchRepositoryNote';

    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('noteRepositoryId', this.noteRepositoryId)
      .append('key', this.key)
      .append('page', page);
    console.log(httpParams);
    if (!this.fetchedPages.has(page)) {
      this.fetchedPages.add(page);
    }


    this.http
      .get<{ Data: ItemData[] }>(
        url,{params: httpParams}
      )
      .pipe(catchError(() => of({ Data: [] })))
      .subscribe(res => {
        this.cachedData.splice(0,this.cachedData.length);
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.Data);
        this.dataStream.next(this.cachedData);
      });
  }

  public fetchPage(page: number): void {
    let url = this.config.baseURL + '/api/Note/SearchRepositoryNote';

    let httpParams = new HttpParams()
      .append('token', this.token!)
      .append('noteRepositoryId', this.noteRepositoryId)
      .append('key', this.key)
      .append('page', page);
    console.log(httpParams);
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.http
      .get<{ Data: ItemData[] }>(
        url,{params: httpParams}
      )
      .pipe(catchError(() => of({ Data: [] })))
      .subscribe(res => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.Data);
        this.dataStream.next(this.cachedData);
      });
  }
}
