import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private BASE_URL = `${environment.apiUrl}customer`;
 
  constructor(private http: HttpClient) {
  }

  getAll(params): Observable<any> {
    const url = `${this.BASE_URL}/all?${params}`;
    return this.http.get<any>(url);
  }

  
  customerDelete(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<any>(url);
  }

  customerBlock(id): Observable<any> {
    const url = `${this.BASE_URL}/blocked/${id}`;
    return this.http.delete<any>(url);
  }

  customerUnBlock(id): Observable<any> {
    const url = `${this.BASE_URL}/unblocked/${id}`;
    return this.http.delete<any>(url);
  }

  customerDetail(id): Observable<any> {
    const url = `${this.BASE_URL}/details/${id}`;
    return this.http.get<any>(url);
  }


}
