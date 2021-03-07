import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private BASE_URL = `${environment.apiUrl}product`;

  constructor(private http: HttpClient) {
  }

  productsGet(params): Observable<any> {
    const url = `${this.BASE_URL}/?${params}`;
    return this.http.get<any>(url);
  }

  productGet(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  productAdd(data): Observable<any> {
    const url = `${this.BASE_URL}`;
    return this.http.post<any>(url, data);
  }

  productEdit(id, data): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.put<any>(url, data);
  }

  productDelete(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<any>(url);
  }

}
