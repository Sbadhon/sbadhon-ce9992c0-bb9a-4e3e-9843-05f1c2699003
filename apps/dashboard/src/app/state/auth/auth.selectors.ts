import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY } from './auth.reducer';
import { AuthState } from './auth.models';

export const selectAuth = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);
export const selectToken = createSelector(selectAuth, (state) => state.token);
export const selectAuthStatus = createSelector(selectAuth, (state) => state.status);
export const selectIsAuthed = createSelector(selectToken, (token) => !!token);
export const selectRole = createSelector(selectAuth, (state) => state.role);
export const selectOrgId = createSelector(selectAuth, (state) => state.orgId);
export const selectUserId = createSelector(selectAuth, (state) => state.user?.id);
