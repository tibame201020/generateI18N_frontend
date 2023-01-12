import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReplaceTarget, TransFile, TransResult } from './model/models';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  preview(transFile: TransFile): Observable<TransFile> {
    return this.http.post<TransFile>(
      environment.apiUrl + '/preview', transFile
    );
  }

  trans(transFile: TransFile): Observable<TransResult> {
    return this.http.post<TransResult>(
      environment.apiUrl + '/trans', transFile
    );
  }

  commitChange(transResult: TransResult): Observable<boolean> {
    return this.http.post<boolean>(
      environment.apiUrl + '/commitChange', transResult
    );
  }



}
