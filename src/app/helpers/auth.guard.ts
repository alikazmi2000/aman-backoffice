// Angular
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
// RxJS
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
// Auth reducers and selectors
import {AppState} from '../store/app.states';
import {AuthService} from '../services/auth.service';
import {isSuccessResponse} from './helpers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router, private authservice: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authservice.validateToken().pipe(
      map((data) => {
        if (isSuccessResponse(data)) {
          return true;
        } else {
          this.router.navigateByUrl('/login');
          return false;
        }
      }),
      catchError(() => {
        this.router.navigateByUrl('/login');
        return of(false);
      }),
    );
  }
}
