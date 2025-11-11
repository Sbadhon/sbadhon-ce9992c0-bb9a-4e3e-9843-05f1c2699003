import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuditListQueryDto, AuditLog } from './audit-log.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditLogApi {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiBase}/v1/audit`;

  list({ limit, userId, action, since }: AuditListQueryDto = {}): Observable<AuditLog[]> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    if (userId) params = params.set('userId', userId);
    if (action) params = params.set('action', action);
    if (since) params = params.set('since', since);
    return this.http.get<AuditLog[]>(this.apiBase, { params });
  }  
}
