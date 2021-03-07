import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtherService {
  private BASE_URL = `${environment.apiUrl}others`;

  constructor(private http: HttpClient) {
  }

  dashboard(data): Observable<any> {
    const url = `${this.BASE_URL}/dashboard`;
    return this.http.get<any>(url, data);
  }

  setting(): Observable<any> {
    const url = `${this.BASE_URL}/settings`;
    return this.http.get<any>(url);
  }

  upload(data): Observable<any> {
    const url = `${this.BASE_URL}/upload`;
    return this.http.post<any>(url, data);
  }

  updateSetting(data): Observable<any> {
    const url = `${this.BASE_URL}/settings`;
    return this.http.post<any>(url, data);
  }
}
