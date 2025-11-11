import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtSession } from '@turbovets-workspace/data';
import { CreateUserDto } from '@turbovets-workspace/data';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import {
  RolesGuard,
  RequireRoles,
  CurrentUser,
} from '@turbovets-workspace/auth';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}
  @RequireRoles('OWNER')
  @Post()
  create(@CurrentUser() me: JwtSession, @Body() dto: CreateUserDto) {
    return this.users.createUserInOrg(
      me.role,
      me.orgId,
      dto.email,
      dto.password,
      dto.role
    );
  }
}
