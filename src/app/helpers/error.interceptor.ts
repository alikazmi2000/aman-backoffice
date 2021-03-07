import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        return throwError('You are not Authorized for this request.');
      }

      if (typeof err.error.meta !== 'undefined') {
        const error = err.error.meta.message || err.statusText;
        return throwError(error);
      } else {
        return throwError('Something went wrong please try again.');
      }
    }));
  }
}
