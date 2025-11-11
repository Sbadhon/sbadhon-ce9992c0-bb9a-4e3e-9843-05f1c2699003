export interface AuditLogDto {
    id: string;
    orgId: string;
    userId: string;
    action: string;
    meta: Record<string, unknown> | null;
    createdAt: string;
  }
  