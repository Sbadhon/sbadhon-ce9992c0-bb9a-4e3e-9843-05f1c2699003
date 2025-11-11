import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { Status } from '../../state/auth/auth.models';
import * as AuthSelectors from '../../state/auth/auth.selectors';

export const RoleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[];

  return store.select(AuthSelectors.selectAuthStatus).pipe(
    take(1),
    map((status) => {
      if (status !== Status.Authenticated) {
        router.navigate(['/login'], { queryParams: { redirect: state.url } });
        return false;
      }
      return true;
    }),
    // Now verify the role after checking authentication
    // Chain another select for clarity
    // Angular doesn’t support multi-stream chaining easily in guards,
    // so we’ll just check synchronously from the same store snapshot:
    map(() => {
      let role: string | null = null;
      store.select(AuthSelectors.selectRole).pipe(take(1)).subscribe((r) => (role = r));

      if (!role || (expectedRoles && !expectedRoles.includes(role))) {
        router.navigate(['/forbidden']);
        return false;
      }

      return true;
    })
  );
};
