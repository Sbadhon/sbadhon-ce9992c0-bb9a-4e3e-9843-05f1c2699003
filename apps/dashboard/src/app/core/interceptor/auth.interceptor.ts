import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { first, Observable, switchMap } from 'rxjs';
import * as AuthSelectors from '../../state/auth/auth.selectors';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly store = inject(Store);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.store.select(AuthSelectors.selectToken).pipe(
      first(),
      switchMap(token => {
        if (!token) {
          return next.handle(req);
        }

        const authed = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });

        return next.handle(authed);
      })
    );
  }
}
