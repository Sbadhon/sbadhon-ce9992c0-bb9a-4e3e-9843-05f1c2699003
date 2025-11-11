export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskCategory {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
}

export interface Task {
  id: string;
  orgId: string;
  createdByUserId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  category?: TaskCategory | null;
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const TaskStatusLabel: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
};

export const TaskCategoryLabel: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: 'Work',
  [TaskCategory.PERSONAL]: 'Personal',
};
