import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import APP_SETTINGS from '../helpers/settings';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) {
  }

  userAdd(data): Observable<any> {
    const url = `${this.BASE_URL}`;
    return this.http.post<any>(url, data);
  }

  userEdit(id, data): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.post<any>(url, data);
  }

  userDelete(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<any>(url);
  }

  userGet(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  userUpdateStatus(data): Observable<any> {
    const url = `${this.BASE_URL}/update_status`;
    return this.http.post<any>(url, {user_id: data.id, status: data.status, role: data.role});
  }

  userUpdateProfile(data): Observable<any> {
    const url = `${this.BASE_URL}/update_user`;
    return this.http.post<any>(url, { ...data, role: APP_SETTINGS.role});
  }

  userChangePassword(data): Observable<any> {
    const url = `${this.BASE_URL}/change_password`;
    return this.http.post<any>(url, { ...data, password_status: APP_SETTINGS.changePasswordStatus.Change});
  }

  usersGet(params): Observable<any> {
    const url = `${this.BASE_URL}?${params}`;
    return this.http.get<any>(url);
  }
}
