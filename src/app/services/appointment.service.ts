import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private BASE_URL = `${environment.apiUrl}jobs/appointments`;

  constructor(private http: HttpClient) {
  }

  appointmentGet(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  appointmentsGet(params): Observable<any> {
    const url = `${this.BASE_URL}?${params}`;
    return this.http.get<any>(url);
  }
}
