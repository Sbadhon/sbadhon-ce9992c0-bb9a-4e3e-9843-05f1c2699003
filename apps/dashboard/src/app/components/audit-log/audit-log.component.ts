import {
  Component,
  ChangeDetectionStrategy,
  inject,
  Output,
  EventEmitter,
  effect,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditListQueryDto, AuditLog } from '@app/state/audit-log/audit-log.models';
import { Store } from '@ngrx/store';
import * as AuditLogActions from '../../state/audit-log/audit-log.actions';
import * as AuditLogSelectors from '../../state/audit-log/audit-log.selectors';
import { NgIconsModule } from '@ng-icons/core';
import * as AuthSelectors from '../../state/auth/auth.selectors';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe, NgIconsModule],
})
export class AuditLogComponent {
  private store = inject(Store);
  @Output() closed = new EventEmitter<void>();

  logs = this.store.selectSignal(AuditLogSelectors.selectAuditLog);

  constructor() {
    effect(() => {
      const userId = this.store.selectSignal(AuthSelectors.selectUserId);
      const query: AuditListQueryDto ={
        userId :userId(), 
      }
      this.store.dispatch(AuditLogActions.loadAudit({query}));
    });
  }
  getLogMessage(log: AuditLog): string {
    const title = 'Audit Log';
    switch (log.action) {
      case 'create':
        return `Created task ${title}.`;
      case 'update':
        return `Updated task ${title}.`;
      case 'delete':
        return `Deleted task ${title}.`;
      default:
        return 'An action was performed.';
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
