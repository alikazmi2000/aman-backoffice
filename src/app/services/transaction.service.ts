import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private BASE_URL = `${environment.apiUrl}transactions`;

  constructor(private http: HttpClient) {
  }

  transactionGet(id): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<any>(url);
  }

  transactionsGet(params): Observable<any> {
    const url = `${this.BASE_URL}?${params}`;
    return this.http.get<any>(url);
  }
}
