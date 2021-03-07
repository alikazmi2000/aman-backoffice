import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private BASE_URL = `${environment.apiUrl}category`;

  constructor(private http: HttpClient) {
  }

  categoriesGetAll(params): Observable<any> {
    const url = `${this.BASE_URL}/all?${params}`;
    return this.http.get<any>(url);
  }

  categoriesGet(params): Observable<any> {
    const url = `${this.BASE_URL}/?sort=createdAt&order=-1&${params}`;
    return this.http.get<any>(url);
    // const url = `${this.BASE_URL}?${params}`;
    // return this.http.get<any>(url);
  }

  categoryGetAll(id=''): Observable<any> {
    const url = `${this.BASE_URL}/drop-down`;
    return this.http.get<any>(url);
  }

  categoryGet(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  categoryAdd(data): Observable<any> {
    const url = `${this.BASE_URL}`;
    return this.http.post<any>(url, data);
  }

  categoryEdit(id, data): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.put<any>(url, data);
  }

  categoryDelete(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<any>(url);
  }

}
