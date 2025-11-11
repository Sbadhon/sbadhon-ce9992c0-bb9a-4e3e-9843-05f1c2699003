import type { AppRole } from './roles.decorator';

export const canReadTasks = (role: AppRole) =>
  role === 'OWNER' || role === 'ADMIN' || role === 'VIEWER';

export const canWriteTasks = (role: AppRole) =>
  role === 'OWNER' || role === 'ADMIN';