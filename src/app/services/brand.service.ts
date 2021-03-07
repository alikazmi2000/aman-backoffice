import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private BASE_URL = `${environment.apiUrl}brand`;

  constructor(private http: HttpClient) {
  }


  brandsGet(params): Observable<any> {
    const url = `${this.BASE_URL}/?sort=createdAt&order=-1&${params}`;
    return this.http.get<any>(url);
    // const url = `${this.BASE_URL}?${params}`;
    // return this.http.get<any>(url);
  }


  brandGetAll(id=''): Observable<any> {
    console.log(`${this.BASE_URL}`);
    const url = `${this.BASE_URL}/all`;
    return this.http.get<any>(url);
  }

  brandAdd(data): Observable<any> {
    const url = `${this.BASE_URL}`;
    return this.http.post<any>(url, data);
  }

  brandGet(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  brandEdit(id, data): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.put<any>(url, data);
  }

  brandDelete(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<any>(url);
  }



}
