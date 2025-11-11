import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  Input,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as AuthSelectors from '../state/auth/auth.selectors';
import type { Role } from '../state/auth/auth.models';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly store = inject(Store);
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);

  private allowed: Role[] = [];
  private hasView = false;
  private currentRole: Role | null = null;

  constructor() {
    this.store
      .select(AuthSelectors.selectRole)
      .pipe(takeUntilDestroyed())
      .subscribe((role) => {
        this.currentRole = role ?? null;
        this.render();
      });
  }

  @Input()
  set appHasRole(roles: Role[] | Role) {
    this.allowed = Array.isArray(roles) ? roles : [roles];
    this.render();
  }

  private render() {
    const canShow =
      !!this.currentRole && this.allowed.includes(this.currentRole);

    if (canShow && !this.hasView) {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tpl);
      this.hasView = true;
    } else if (!canShow && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
