import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import APP_SETTINGS from '../helpers/settings';

import { Auth } from '../models/auth';

@Injectable()
export class AuthService {
  private BASE_URL = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) {}

  getToken(): string {
    return localStorage.getItem('token');
  }

  logIn(email: string, password: string): Observable<any> {
    const url = `${this.BASE_URL}/login`;
    return this.http.post<Auth>(url, {email, password, role: APP_SETTINGS.role});
  }

  validateToken(): Observable<any> {
    const url = `${this.BASE_URL}/validate_token`;
    return this.http.get<any>(url, {params: {role: APP_SETTINGS.role}});
  }
}
