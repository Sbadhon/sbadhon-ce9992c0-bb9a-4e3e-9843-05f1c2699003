import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUDIT_LOG_FEATURE_KEY, AuditLogState } from './audit-log.reducer';


export const selectAuditLogState =
  createFeatureSelector<AuditLogState>(AUDIT_LOG_FEATURE_KEY);

export const selectAuditLog = createSelector(
  selectAuditLogState,
  (state) => state.auditLog
);

export const selectAuditLogLoading = createSelector(
  selectAuditLogState,
  (state) => state.loading
);

export const selectAuditLogError = createSelector(
  selectAuditLogState,
  (state) => state.error
);
