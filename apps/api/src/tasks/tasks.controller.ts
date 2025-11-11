import { Body, Controller, Delete, Get, Param, Post, Put, Patch, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RequireRoles, RolesGuard, OrgScopeGuardDefault, CurrentUser } from '@turbovets-workspace/auth';
import type { JwtSession } from '@turbovets-workspace/data';
import { TaskStatus, TaskCategory, RoleEnum } from '@turbovets-workspace/data';
import { CreateTaskDto, UpdateTaskDto } from '@turbovets-workspace/data';

const blank = (v?: string | null) => !v || v.trim() === '' || v === 'undefined';

@UseGuards(JwtAuthGuard, RolesGuard, OrgScopeGuardDefault)
@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @Get()
  @RequireRoles(RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Viewer)
  async list(
    @CurrentUser() me: JwtSession,
    @Query('orgId') orgId?: string,
    @Query('status') status?: TaskStatus,
    @Query('category') category?: TaskCategory
  ) {
    const effectiveOrgId = blank(orgId) ? me.orgId : orgId;
    const s = blank(status) ? undefined : status;
    const c = blank(category) ? undefined : category;
    return this.svc.list(effectiveOrgId, me.role, { status: s, category: c });
  }

  @Post()
  @RequireRoles(RoleEnum.Owner, RoleEnum.Admin)
  async create(@CurrentUser() me: JwtSession, @Body() dto: CreateTaskDto) {
    return this.svc.create(me.orgId, me.role, me.sub, dto);
  }

  @Put(':id')
  @RequireRoles(RoleEnum.Owner, RoleEnum.Admin)
  async updatePut(@CurrentUser() me: JwtSession, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.svc.update(me.orgId, me.role, me.sub, id, dto);
  }

  @Patch(':id')
  @RequireRoles(RoleEnum.Owner, RoleEnum.Admin)
  async updatePatch(@CurrentUser() me: JwtSession, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.svc.update(me.orgId, me.role, me.sub, id, dto);
  }

  @Delete(':id')
  @RequireRoles(RoleEnum.Owner, RoleEnum.Admin)
  async remove(@CurrentUser() me: JwtSession, @Param('id') id: string) {
    return this.svc.remove(me.orgId, me.role, me.sub, id);
  }
}
