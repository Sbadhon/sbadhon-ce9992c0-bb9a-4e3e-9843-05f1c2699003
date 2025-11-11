import 'reflect-metadata';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import AppDataSource from './database/data-source';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';
import { Role, TaskCategory, TaskStatus } from '@turbovets-workspace/data';

async function getOrCreateOrg(
  repo: Repository<Organization>,
  name: string,
  parent?: Organization | null
): Promise<Organization> {
  const existing = await repo.findOne({ where: { name } });
  if (existing) return existing;
  const org = repo.create({ name, parent: parent ?? null });
  return repo.save(org);
}

async function mkUser(
  userRepo: Repository<User>,
  email: string,
  pwd: string,
  orgId: string,
  role: Role
): Promise<User> {
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(pwd, 10);
  const user = userRepo.create({ email, passwordHash, orgId, role });
  return userRepo.save(user);
}

async function upsertTask(
  taskRepo: Repository<Task>,
  data: {
    orgId: string;
    title: string;
    description?: string | null;
    category?: TaskCategory | null;
    status: TaskStatus;
    createdByUserId: string;
    order?: number;
    dueDate?: Date | null;
  }
): Promise<Task> {
  const existing = await taskRepo.findOne({
    where: { orgId: data.orgId, title: data.title },
  });
  if (existing) return existing;

  const t = taskRepo.create({
    orgId: data.orgId,
    createdByUserId: data.createdByUserId,
    title: data.title,
    description: data.description ?? null,
    status: data.status,
    category: data.category ?? null,
    order: data.order ?? 0,
    dueDate: data.dueDate ?? null,
  });
  return taskRepo.save(t);
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function seedOwnerTasks(taskRepo: Repository<Task>, orgId: string, ownerId: string) {
  const base = [
    {
      title: 'Org-level onboarding',
      description: 'Prepare company-wide onboarding materials and checklists',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      order: 0,
      dueDate: daysFromNow(3),
    },
    {
      title: 'Quarterly planning review',
      description: 'Align OKRs with department heads',
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.WORK,
      order: 1,
      dueDate: daysFromNow(10),
    },
    {
      title: 'Vendor contract sign-off',
      description: 'Sign renewal with CDN provider',
      status: TaskStatus.DONE,
      category: TaskCategory.WORK,
      order: 0,
      dueDate: daysFromNow(-2),
    },
    {
      title: 'Owner: roadmap approval',
      description: 'Finalize Q1 product roadmap',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      order: 2,
      dueDate: daysFromNow(14),
    },
  ];

  for (const t of base) {
    await upsertTask(taskRepo, {
      orgId,
      createdByUserId: ownerId,
      ...t,
    });
  }
}

async function seedAdminTasks(taskRepo: Repository<Task>, orgId: string, adminId: string) {
  const base = [
    {
      title: 'East Region Kickoff',
      description: 'Kickoff deck & schedule for regional teams',
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.WORK,
      order: 0,
      dueDate: daysFromNow(5),
    },
    {
      title: 'Ops runbook update',
      description: 'Refresh escalation tree and on-call rotations',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      order: 1,
      dueDate: daysFromNow(7),
    },
    {
      title: 'Admin: access audit',
      description: 'Review permissions for new hires',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      order: 2,
      dueDate: daysFromNow(9),
    },
  ];

  for (const t of base) {
    await upsertTask(taskRepo, {
      orgId,
      createdByUserId: adminId,
      ...t,
    });
  }
}

async function seedViewerTasks(taskRepo: Repository<Task>, orgId: string, viewerId: string) {
  const base = [
    {
      title: 'Viewer onboarding',
      description: 'Read-only intro to dashboards',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      order: 0,
      dueDate: daysFromNow(2),
    },
    {
      title: 'Report feedback',
      description: 'Collect feedback on weekly analytics',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      order: 1,
      dueDate: daysFromNow(6),
    },
    {
      title: 'Documentation review',
      description: 'Review wiki pages for product area',
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.WORK,
      order: 0,
      dueDate: daysFromNow(8),
    },
  ];

  for (const t of base) {
    await upsertTask(taskRepo, {
      orgId,
      createdByUserId: viewerId,
      ...t,
    });
  }
}

async function run() {
  const ds = await AppDataSource.initialize();

  try {
    await ds.runMigrations();

    const orgRepo = ds.getRepository(Organization);
    const userRepo = ds.getRepository(User);
    const taskRepo = ds.getRepository(Task);

    const parent = await getOrCreateOrg(orgRepo, 'Parent Org');
    const child = await getOrCreateOrg(orgRepo, 'Child Org', parent);

    const owner  = await mkUser(userRepo, 'owner@turbovets.com',  'Password123!', parent.id, 'OWNER');
    const admin  = await mkUser(userRepo, 'admin@turbovets.com',  'Password123!', parent.id, 'ADMIN');
    const viewer = await mkUser(userRepo, 'viewer@turbovets.com', 'Password123!', child.id,  'VIEWER');

    await seedOwnerTasks(taskRepo, parent.id, owner.id);
    await seedAdminTasks(taskRepo, parent.id, admin.id);
    await seedViewerTasks(taskRepo, child.id, viewer.id);

    console.log('Seed complete');
  } finally {
    await AppDataSource.destroy();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
