import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Task } from '../entities/task.entity';
import { AuditService } from '../audit/audit.service';
import type { CreateTaskDto, UpdateTaskDto } from '@turbovets-workspace/data';
import type { Role } from '@turbovets-workspace/data';
import { TaskStatus, TaskCategory } from '@turbovets-workspace/data';
import type { JsonObject, JsonValue } from 'type-fest';
import { canReadTasks, canWriteTasks } from '@turbovets-workspace/auth';

type Change = { from: JsonValue; to: JsonValue } & JsonObject;
type ChangeMap = { [k: string]: Change } & JsonObject;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasks: Repository<Task>,
    private readonly audit: AuditService
  ) {}

  async list(
    orgId: string,
    role: Role,
    filter: { status?: TaskStatus | string; category?: TaskCategory | string }
  ) {
    if (!canReadTasks(role))
      throw new ForbiddenException('Insufficient role to read tasks');

    const where: FindOptionsWhere<Task> = { orgId };

    const valid = (v: any) =>
      v !== undefined &&
      v !== null &&
      v !== '' &&
      v !== 'undefined' &&
      v !== 'null';

    if (valid(filter.status)) where.status = filter.status as TaskStatus;
    if (valid(filter.category))
      where.category = filter.category as TaskCategory;

    return this.tasks.find({ where, order: { createdAt: 'DESC' } });
  }

  async create(orgId: string, role: Role, userId: string, dto: CreateTaskDto) {
    if (!canWriteTasks(role)) {
      throw new ForbiddenException('Insufficient role to create task');
    }

    const row = this.tasks.create({
      orgId,
      createdByUserId: userId,
      title: dto.title,
      description: dto.description ?? null,
      status: TaskStatus.TODO,
      category: dto.category ?? null,
    });

    const saved = await this.tasks.save(row);

    await this.audit.log({
      orgId,
      userId,
      action: 'TASK_CREATE',
      resource: 'task',
      resourceId: saved.id,
      meta: { title: saved.title } as JsonObject,
    });

    return saved;
  }

  async update(
    orgId: string,
    role: Role,
    userId: string,
    id: string,
    dto: UpdateTaskDto
  ) {
    if (!canWriteTasks(role)) {
      throw new ForbiddenException('Insufficient role to update task');
    }

    const existing = await this.tasks.findOneOrFail({ where: { id, orgId } });

    const prev = { ...existing };

    if (typeof dto.title !== 'undefined') existing.title = dto.title;
    if (typeof dto.description !== 'undefined')
      existing.description = dto.description;
    if (typeof dto.status !== 'undefined')
      existing.status = dto.status as TaskStatus;
    if (typeof dto.category !== 'undefined')
      existing.category = dto.category as TaskCategory;

    const saved = await this.tasks.save(existing);

    const changed: ChangeMap = {};
    if (prev.title !== saved.title)
      changed.title = {
        from: prev.title as JsonValue,
        to: saved.title as JsonValue,
      };
    if (prev.description !== saved.description)
      changed.description = {
        from: prev.description ?? (null as JsonValue),
        to: saved.description ?? (null as JsonValue),
      };
    if (prev.status !== saved.status)
      changed.status = {
        from: prev.status as JsonValue,
        to: saved.status as JsonValue,
      };
    if (prev.category !== saved.category)
      changed.category = {
        from: prev.category ?? (null as JsonValue),
        to: saved.category ?? (null as JsonValue),
      };

    if (Object.keys(changed).length > 0) {
      await this.audit.log({
        orgId,
        userId,
        action: 'TASK_UPDATE',
        resource: 'task',
        resourceId: saved.id,
        meta: { changed },
      });
    }

    return saved;
  }

  async remove(orgId: string, role: Role, userId: string, id: string) {
    if (!canWriteTasks(role)) {
      throw new ForbiddenException('Insufficient role to delete task');
    }

    const existing = await this.tasks.findOneOrFail({ where: { id, orgId } });
    await this.tasks.remove(existing);

    await this.audit.log({
      orgId,
      userId,
      action: 'TASK_DELETE',
      resource: 'task',
      resourceId: id,
      meta: { title: existing.title } as JsonObject,
    });

    return { id };
  }
}
