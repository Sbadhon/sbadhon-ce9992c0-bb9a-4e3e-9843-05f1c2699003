import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditListQueryDto } from '@turbovets-workspace/data';

import type { JsonObject } from 'type-fest';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async list( query: AuditListQueryDto) {
    const take = Math.min(Math.max(query.limit ?? 50, 1), 200);
    return this.auditRepo.find({
      where: {
        userId:  query.userId,
        action: query.action
      },
      order: { createdAt: 'DESC' },
      take,
    });
  }

  async log(input: {
    orgId: string;
    userId: string;
    action: string;
    resource: 'task';
    resourceId: string;
    meta?: JsonObject | null;
  }) {
    const row = this.auditRepo.create({
      orgId: input.orgId,
      userId: input.userId,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId,
      meta: input.meta ?? null,
    });
    return this.auditRepo.save(row);
  }
}
