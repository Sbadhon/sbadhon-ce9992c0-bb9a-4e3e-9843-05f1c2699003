import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TASKS_FEATURE_KEY, TasksState } from './task.reducer';
import { TaskStatus } from './task.models';

export const selectTasksState =
  createFeatureSelector<TasksState>(TASKS_FEATURE_KEY);

export const selectAllTasks = createSelector(
  selectTasksState,
  s => s.items
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  s => s.loading
);

export const selectTasksError = createSelector(
  selectTasksState,
  s => s.error
);

export const selectTasksGroupedByStatus = createSelector(
  selectAllTasks,
  (tasks) => {
    const groups: Record<TaskStatus, typeof tasks> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };
    for (const t of tasks) groups[t.status].push(t);
    (Object.keys(groups) as (keyof typeof groups)[]).forEach(k => {
      groups[k] = groups[k].slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });
    return groups;
  }
);
