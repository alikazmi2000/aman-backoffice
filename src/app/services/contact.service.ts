import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private BASE_URL = `${environment.apiUrl}contact`;

  constructor(private http: HttpClient) {
  }

  contactsGet(params): Observable<any> {
    const url = `${this.BASE_URL}/?sort=createdAt&order=-1&${params}`;
    return this.http.get<any>(url);
  }


  contactsDetail(order_id): Observable<any> {
    const url = `${this.BASE_URL}/${order_id}`;
    return this.http.get<any>(url);
  }


}
