import { createAction, props } from '@ngrx/store';
import { AuditListQueryDto, AuditLog } from './audit-log.models';

export const loadAudit = createAction(
  '[Audit] Load',
  props<{ query?: AuditListQueryDto }>()
);

export const loadAuditSuccess = createAction(
  '[Audit] Load Success',
  props<{ auditLog: AuditLog[] }>()
);

export const loadAuditFailure = createAction(
  '[Audit] Load Failure',
  props<{ error: unknown }>()
);