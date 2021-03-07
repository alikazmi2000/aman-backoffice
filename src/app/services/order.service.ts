import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private BASE_URL = `${environment.apiUrl}order`;

  constructor(private http: HttpClient) {
  }

  ordersGet(params): Observable<any> {
    const url = `${this.BASE_URL}/?sort=createdAt&order=-1&${params}`;
    return this.http.get<any>(url);
  }


  ordersDetail(order_id): Observable<any> {
    const url = `${this.BASE_URL}/details/${order_id}`;
    return this.http.get<any>(url);
  }

  ordersStatus(order_id,data): Observable<any> {
    const url = `${this.BASE_URL}/change-status/${order_id}`;
    return this.http.post<any>(url,data);
  }


}
