import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from '../../state/auth/auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApi } from './auth.api';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private api = inject(AuthApi);
  private router = inject(Router);

  hydrate$ = createEffect(() => this.actions$.pipe(
    ofType('@ngrx/effects/init'),
    map(() => AuthActions.hydrateFromStorage())
  ));

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    mergeMap(({ email, password }) =>
      this.api.login(email, password).pipe(
        map(payload => AuthActions.loginSuccess(payload)),
        catchError(err => of(AuthActions.loginFailure({ error: err?.error?.message ?? 'Login failed' })))
      )
    )
  ));

  loginSuccessNav$ = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigateByUrl('/tasks'))
    ),
    { dispatch: false }
  );
}
