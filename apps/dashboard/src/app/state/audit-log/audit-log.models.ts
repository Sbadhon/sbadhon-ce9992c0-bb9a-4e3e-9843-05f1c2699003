export interface AuditLog {
  id: string;
  orgId: string;
  userId: string;
  action: string;
  resource: 'task';
  resourceId: string;
  meta?: Record<string, unknown> | null;
  createdAt: Date;
}


export class AuditListQueryDto {
  limit?: number = 50;
  userId?: string;
  action?: string;
  since?: string;
}