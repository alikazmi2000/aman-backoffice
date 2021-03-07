import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private BASE_URL = `${environment.apiUrl}documents`;

  constructor(private http: HttpClient) {
  }

  documentsGetAll(): Observable<any> {
    const url = `${this.BASE_URL}/all`;
    return this.http.get<any>(url);
  }
}
