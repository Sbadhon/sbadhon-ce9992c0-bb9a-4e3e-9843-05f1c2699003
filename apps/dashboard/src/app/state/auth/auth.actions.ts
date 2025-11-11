import { createAction, props } from '@ngrx/store';
import { AuthPayload } from './auth.models';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string;}>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<AuthPayload>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const hydrateFromStorage = createAction('[Auth] Hydrate From Storage');
