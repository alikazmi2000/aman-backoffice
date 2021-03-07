import { UserActionTypes, All } from '../actions/user.actions';


export interface State {
  userAdding: boolean;
  userAddSuccessMessage: string;
  userAddErrorMessage: string;

  userEditing: boolean;
  userEditSuccessMessage: string;
  userEditErrorMessage: string;

  userDeleting: boolean;
  userDeleteSuccessMessage: string;
  userDeleteErrorMessage: string;

  userGetting: boolean;
  user: any;
  userGetSuccessMessage: string;
  userGetErrorMessage: string;

  usersGetting: boolean;
  users: any;
  usersGetSuccessMessage: string;
  usersGetErrorMessage: string;
}

export const initialState: State = {
  userAdding: false,
  userAddSuccessMessage: '',
  userAddErrorMessage: '',

  userEditing: false,
  userEditSuccessMessage: '',
  userEditErrorMessage: '',

  userDeleting: false,
  userDeleteSuccessMessage: '',
  userDeleteErrorMessage: '',

  userGetting: false,
  user: false,
  userGetSuccessMessage: '',
  userGetErrorMessage: '',

  usersGetting: false,
  users: false,
  usersGetSuccessMessage: '',
  usersGetErrorMessage: ''
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case UserActionTypes.USER_ADD: {
      return {
        ...state,
        userAdding: true,
        userAddSuccessMessage: '',
        userAddErrorMessage: '',
      };
    }
    case UserActionTypes.USER_ADD_SUCCESS: {
      return {
        ...state,
        userAdding: false,
        userAddSuccessMessage: action.payload.message ? action.payload.message : 'User added Successfully.',
        userAddErrorMessage: '',
      };
    }
    case UserActionTypes.USER_ADD_FAILURE: {
      return {
        ...state,
        userAdding: false,
        userAddSuccessMessage: '',
        userAddErrorMessage: action.payload.message ? action.payload.message : 'Unable to add user with provided details.',
      };
    }
    case UserActionTypes.USER_EDIT: {
      return {
        ...state,
        userEditing: true,
        userEditSuccessMessage: '',
        userEditErrorMessage: '',
      };
    }
    case UserActionTypes.USER_EDIT_SUCCESS: {
      return {
        ...state,
        userEditing: false,
        userEditSuccessMessage: action.payload.message ? action.payload.message : 'User updated Successfully.',
        userEditErrorMessage: '',
      };
    }
    case UserActionTypes.USER_EDIT_FAILURE: {
      return {
        ...state,
        userEditing: false,
        userEditSuccessMessage: '',
        userEditErrorMessage: action.payload.message ? action.payload.message : 'Unable to update the user with provided details.',
      };
    }
    case UserActionTypes.USER_DELETE: {
      return {
        ...state,
        userDeleting: true,
        userDeleteSuccessMessage: '',
        userDeleteErrorMessage: '',
      };
    }
    case UserActionTypes.USER_DELETE_SUCCESS: {
      return {
        ...state,
        userDeleting: false,
        userDeleteSuccessMessage: action.payload.message ? action.payload.message : 'User found Successfully.',
        userDeleteErrorMessage: '',
      };
    }
    case UserActionTypes.USER_DELETE_FAILURE: {
      return {
        ...state,
        userDeleting: false,
        userDeleteSuccessMessage: '',
        userDeleteErrorMessage: action.payload.message ? action.payload.message : 'Unable to find user.',
      };
    }
    case UserActionTypes.USER_GET: {
      return {
        ...state,
        userGetting: true,
        user: {},
        userGetSuccessMessage: '',
        userGetErrorMessage: '',
      };
    }
    case UserActionTypes.USER_GET_SUCCESS: {
      return {
        ...state,
        userGetting: false,
        user: action.payload.user,
        userGetSuccessMessage: action.payload.message ? action.payload.message : 'User found Successfully.',
        userGetErrorMessage: '',
      };
    }
    case UserActionTypes.USER_GET_FAILURE: {
      return {
        ...state,
        userGetting: false,
        user: {},
        userGetSuccessMessage: '',
        userGetErrorMessage: action.payload.message ? action.payload.message : 'Unable to find user.',
      };
    }
    case UserActionTypes.USERS_GET: {
      return {
        ...state,
        usersGetting: true,
        users: {},
        usersGetSuccessMessage: '',
        usersGetErrorMessage: '',
      };
    }
    case UserActionTypes.USERS_GET_SUCCESS: {
      return {
        ...state,
        usersGetting: false,
        users: action.payload.users,
        usersGetSuccessMessage: action.payload.message ? action.payload.message : 'User found Successfully.',
        usersGetErrorMessage: '',
      };
    }
    case UserActionTypes.USERS_GET_FAILURE: {
      return {
        ...state,
        usersGetting: false,
        users: {},
        usersGetSuccessMessage: '',
        usersGetErrorMessage: action.payload.message ? action.payload.message : 'Unable to find user.',
      };
    }
    default: {
      return state;
    }
  }
}
