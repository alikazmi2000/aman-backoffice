import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private BASE_URL = `${environment.apiUrl}service_areas`;

  constructor(private http: HttpClient) {
  }

  regionAdd(data): Observable<any> {
    const url = `${this.BASE_URL}`;
    return this.http.post<any>(url, data);
  }

  regionEdit(id, data): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.post<any>(url, data);
  }

  regionDelete(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<any>(url);
  }

  regionGet(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  regionsGet(params): Observable<any> {
    const url = `${this.BASE_URL}?${params}`;
    return this.http.get<any>(url);
  }

  regionsGetAll(): Observable<any> {
    const url = `${this.BASE_URL}/all`;
    return this.http.get<any>(url);
  }
}
