import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../../state/auth/auth.selectors';
import { Status } from '../../state/auth/auth.models';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const authStatus = store.selectSignal(AuthSelectors.selectAuthStatus);

  if (authStatus() === Status.Authenticated) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
