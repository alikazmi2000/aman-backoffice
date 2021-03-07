import { Action } from '@ngrx/store';


export enum UserActionTypes {
  USER_ADD = '[User] Add User',
  USER_ADD_SUCCESS = '[User] Add User Success',
  USER_ADD_FAILURE = '[User] Add User Failure',
  USER_EDIT = '[User] Edit User',
  USER_EDIT_SUCCESS = '[User] Edit User Success',
  USER_EDIT_FAILURE = '[User] Edit User Failure',
  USER_DELETE = '[User] Delete User',
  USER_DELETE_SUCCESS = '[User] Delete User Success',
  USER_DELETE_FAILURE = '[User] Delete User Failure',
  USER_GET = '[User] Get Single User',
  USER_GET_SUCCESS = '[User] Get Single User Success',
  USER_GET_FAILURE = '[User] Get Single User Failure',
  USERS_GET = '[User] Get Users',
  USERS_GET_SUCCESS = '[User] Get Users Success',
  USERS_GET_FAILURE = '[User] Get Users Failure'
}

export class UserAdd implements Action {
  readonly type = UserActionTypes.USER_ADD;
  constructor(public payload: any) {}
}

export class UserAddSuccess implements Action {
  readonly type = UserActionTypes.USER_ADD_SUCCESS;
  constructor(public payload: any) {}
}

export class UserAddFailure implements Action {
  readonly type = UserActionTypes.USER_ADD_FAILURE;
  constructor(public payload: any) {}
}

export class UserEdit implements Action {
  readonly type = UserActionTypes.USER_EDIT;
  constructor(public payload: any) {}
}

export class UserEditSuccess implements Action {
  readonly type = UserActionTypes.USER_EDIT_SUCCESS;
  constructor(public payload: any) {}
}

export class UserEditFailure implements Action {
  readonly type = UserActionTypes.USER_EDIT_FAILURE;
  constructor(public payload: any) {}
}

export class UserDelete implements Action {
  readonly type = UserActionTypes.USER_DELETE;
  constructor(public payload: any) {}
}

export class UserDeleteSuccess implements Action {
  readonly type = UserActionTypes.USER_DELETE_SUCCESS;
  constructor(public payload: any) {}
}

export class UserDeleteFailure implements Action {
  readonly type = UserActionTypes.USER_DELETE_FAILURE;
  constructor(public payload: any) {}
}

export class UserGet implements Action {
  readonly type = UserActionTypes.USER_GET;
  constructor(public payload: any) {}
}

export class UserGetSuccess implements Action {
  readonly type = UserActionTypes.USER_GET_SUCCESS;
  constructor(public payload: any) {}
}

export class UserGetFailure implements Action {
  readonly type = UserActionTypes.USER_GET_FAILURE;
  constructor(public payload: any) {}
}

export class UsersGet implements Action {
  readonly type = UserActionTypes.USERS_GET;
  constructor(public payload: any) {}
}

export class UsersGetSuccess implements Action {
  readonly type = UserActionTypes.USERS_GET_SUCCESS;
  constructor(public payload: any) {}
}

export class UsersGetFailure implements Action {
  readonly type = UserActionTypes.USERS_GET_FAILURE;
  constructor(public payload: any) {}
}

export type All =
  | UserAdd
  | UserAddSuccess
  | UserAddFailure
  | UserEdit
  | UserEditSuccess
  | UserEditFailure
  | UserDelete
  | UserDeleteSuccess
  | UserDeleteFailure
  | UserGet
  | UserGetSuccess
  | UserGetFailure
  | UsersGet
  | UsersGetSuccess
  | UsersGetFailure;
