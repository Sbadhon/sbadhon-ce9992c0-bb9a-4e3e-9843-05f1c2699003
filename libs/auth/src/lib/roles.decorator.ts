import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
export enum RoleEnum {
  Viewer = 'VIEWER',
  Admin = 'ADMIN',
  Owner = 'OWNER',
}

export const ROLES_KEY = 'roles';
export type AppRole = 'OWNER' | 'ADMIN' | 'VIEWER';

export const RequireRoles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

export const Role = RoleEnum;

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as { sub: string; email: string; orgId: string; role: AppRole };
});
