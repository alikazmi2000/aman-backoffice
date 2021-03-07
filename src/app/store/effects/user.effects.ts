import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import {UserService} from '../../services/user.service';
import {
  UserActionTypes,
  UserAdd, UserAddSuccess, UserAddFailure,
  UserEdit, UserEditSuccess, UserEditFailure,
  UserDelete, UserDeleteSuccess, UserDeleteFailure,
  UserGet, UserGetSuccess, UserGetFailure,
  UsersGet, UsersGetSuccess, UsersGetFailure
} from '../actions/user.actions';
import {HttpBasicResponse} from '../../models/httpBasicResponse';


@Injectable()
export class UserEffects {

  constructor(
    private actions: Actions,
    private userService: UserService
  ) {
  }

  @Effect()
  UserAdd: Observable<any> = this.actions.pipe(
    ofType(UserActionTypes.USER_ADD),
    map((action: UserAdd) => action.payload),
    switchMap(payload => {
      return this.userService.userAdd(payload)
        .pipe(
          map((user: HttpBasicResponse) => {
            return new UserAddSuccess({user});
          }),
          catchError((error) => {
            return of(new UserAddFailure({ message: error }));
          })
        );
    })
  );

  @Effect()
  UserEdit: Observable<any> = this.actions.pipe(
    ofType(UserActionTypes.USER_EDIT),
    map((action: UserEdit) => action.payload),
    switchMap(payload => {
      return this.userService.userEdit(payload.id, payload.data)
        .pipe(
          map((user: HttpBasicResponse) => {
            return new UserEditSuccess({user});
          }),
          catchError((error) => {
            return of(new UserEditFailure({ message: error }));
          })
        );
    })
  );

  @Effect()
  UserDelete: Observable<any> = this.actions.pipe(
    ofType(UserActionTypes.USER_DELETE),
    map((action: UserDelete) => action.payload),
    switchMap(payload => {
      return this.userService.userDelete(payload)
        .pipe(
          map((user: HttpBasicResponse) => {
            return new UserDeleteSuccess({user});
          }),
          catchError((error) => {
            return of(new UserDeleteFailure({ message: error }));
          })
        );
    })
  );

  @Effect()
  UserGet: Observable<any> = this.actions.pipe(
    ofType(UserActionTypes.USER_GET),
    map((action: UserGet) => action.payload),
    switchMap(payload => {
      return this.userService.userGet(payload)
        .pipe(
          map((user: HttpBasicResponse) => {
            return new UserGetSuccess({message: user.meta.message, user: user.data});
          }),
          catchError((error) => {
            return of(new UserGetFailure({ message: error }));
          })
        );
    })
  );

  @Effect()
  UsersGet: Observable<any> = this.actions.pipe(
    ofType(UserActionTypes.USERS_GET),
    map((action: UsersGet) => action.payload),
    switchMap(payload => {
      return this.userService.usersGet(payload)
        .pipe(
          map((user: HttpBasicResponse) => {
            return new UsersGetSuccess({user});
          }),
          catchError((error) => {
            return of(new UsersGetFailure({ message: error }));
          })
        );
    })
  );
}
