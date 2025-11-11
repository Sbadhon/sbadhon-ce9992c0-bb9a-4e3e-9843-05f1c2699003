import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';

function getAtPath(obj: unknown, path: string): unknown {
  if (!obj) return undefined;
  const segs = path.split('.').filter(Boolean);
  let cur: unknown = obj;
  for (const s of segs) {
    if (typeof cur !== 'object' || cur === null) return undefined;
    cur = (cur as Record<string, unknown>)[s];
  }
  return cur;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v !== 'undefined';
}

@Injectable()
export class OrgScopeGuardDefault implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<{
      user?: { orgId?: string };
      params?: unknown;
      query?: unknown;
      body?: unknown;
    }>();

    const sessionOrgId = (req.user?.orgId ?? '').trim();

    const candidates: Array<unknown> = [
      (req.params as Record<string, unknown> | undefined)?.['orgId'],
      (req.query as Record<string, unknown> | undefined)?.['orgId'],
      (req.body as Record<string, unknown> | undefined)?.['orgId'],
    ];

    for (const c of candidates) {
      if (isNonEmptyString(c) && c.trim() !== sessionOrgId) {
        throw new ForbiddenException('Organization boundary violation');
      }
    }
    return true;
  }
}

export function OrgScopeGuard(path: string): Type<CanActivate> {
  class OrgScopeGuardHost implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
      const req = ctx.switchToHttp().getRequest<{ user?: { orgId?: string } }>();
      const sessionOrgId = (req.user?.orgId ?? '').trim();
      const value = getAtPath(req, path);

      if (isNonEmptyString(value) && value.trim() !== sessionOrgId) {
        throw new ForbiddenException('Organization boundary violation');
      }
      return true;
    }
  }
  return mixin(OrgScopeGuardHost);
}
