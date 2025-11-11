import { createReducer, on, MetaReducer, Action } from '@ngrx/store';
import * as AuthActions from '../../state/auth/auth.actions';
import { AuthState, Status } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';

const initialState: AuthState = {
  token: null,
  user: null,
  orgId: null,
  role: null,
  status: Status.Idle,
  error: null,
};

const reducer = createReducer(
  initialState,
  on(AuthActions.hydrateFromStorage, (state) => {
    try {
      const raw = localStorage.getItem('auth.v1');
      if (!raw) return state;
      const parsed = JSON.parse(raw) as Partial<AuthState>;
      return {
        ...state,
        ...parsed,
        status: parsed.token ? Status.Authenticated : Status.Idle,
      };
    } catch {
      return state;
    }
  }),
  on(AuthActions.login, (state) => ({
    ...state,
    status: Status.Authenticating,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, profile) => {
    const next: AuthState = {
      token: profile.accessToken,
      user: profile.user,
      orgId: profile.orgId,
      role: profile.role,
      status: Status.Authenticated,
      error: null,
    };
    localStorage.setItem('auth.v1', JSON.stringify(next));
    return next;
  }),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    status: Status.Error,
    error,
  })),
  on(AuthActions.logout, () => {
    localStorage.removeItem('auth.v1');
    return initialState;
  })
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}

export const metaReducers: MetaReducer[] = [];
