import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private BASE_URL = `${environment.apiUrl}jobs`;

  constructor(private http: HttpClient) {
  }

  projectAdd(data): Observable<any> {
    const url = `${this.BASE_URL}`;
    return this.http.post<any>(url, data);
  }

  projectEdit(id, data): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.post<any>(url, data);
  }

  projectDelete(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<any>(url);
  }

  projectGet(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  projectGetContract(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}/contract`;
    return this.http.get<any>(url);
  }

  projectsGet(params): Observable<any> {
    const url = `${this.BASE_URL}?${params}`;
    return this.http.get<any>(url);
  }

  projectUpdateStatus(id, data): Observable<any> {
    const url = `${this.BASE_URL}/${id}/status`;
    return this.http.post<any>(url, {status: data.status});
  }
}
