import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuditLogActions from './audit-log.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuditLogApi } from './audit-log.api';
import { Store } from '@ngrx/store';

@Injectable()
export class AuditLogEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(AuditLogApi);
  private readonly store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditLogActions.loadAudit),
      mergeMap((action) => {
        return this.api.list(action.query).pipe(
          map(auditLog => AuditLogActions.loadAuditSuccess({ auditLog })),
          catchError(error => of(AuditLogActions.loadAuditFailure({ error })))
        );
      })
    )
  );
}
