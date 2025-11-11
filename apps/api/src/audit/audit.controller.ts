import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import {
  RolesGuard,
  RequireRoles,
  OrgScopeGuardDefault,
  CurrentUser,
} from '@turbovets-workspace/auth';
import type { JwtSession } from '@turbovets-workspace/data';
import { AuditService } from './audit.service';
import { AuditListQueryDto, RoleEnum } from '@turbovets-workspace/data';


@UseGuards(JwtAuthGuard, RolesGuard, OrgScopeGuardDefault)
@Controller('v1/audit')
export class AuditController {
  constructor(private readonly svc: AuditService) {}

  @Get()
  @RequireRoles(RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Viewer)
  async list(
    @CurrentUser() me: JwtSession,
    @Query() query: AuditListQueryDto
  ) {
    return this.svc.list(query);
  }
}
