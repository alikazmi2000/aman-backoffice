import { createSelector } from '@ngrx/store';


export const selectAuthState = state => state.auth;

export const isLoggedIn = createSelector(
  selectAuthState,
  auth => auth.isAuthenticated
);

export const isLoggedOut = createSelector(
  isLoggedIn,
  loggedIn => !loggedIn
);


export const currentAuthToken = createSelector(
  selectAuthState,
  auth => auth.authToken
);

export const isUserLoaded = createSelector(
  selectAuthState,
  auth => auth.isUserLoaded
);

export const currentUser = createSelector(
  selectAuthState,
  auth => auth.user
);
