import { createReducer, on } from '@ngrx/store';
import * as AuditLogActions from './audit-log.actions';
import { AuditLog } from './audit-log.models';

export const AUDIT_LOG_FEATURE_KEY = 'auditLog';

export interface AuditLogState {
  auditLog: AuditLog[];
  loading: boolean;
  error: unknown | null;
}

export const initialState: AuditLogState = {
  auditLog: [],
  loading: false,
  error: null,
};


export const auditLogReducer = createReducer(
  initialState,

  on(AuditLogActions.loadAudit, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuditLogActions.loadAuditSuccess, (state, { auditLog }) => ({
    ...state,
    auditLog,
    loading: false,
    error: null,
  })),

  on(AuditLogActions.loadAuditFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
