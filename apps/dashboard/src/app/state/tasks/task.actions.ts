import { createAction, props } from '@ngrx/store';
import { Task } from './task.models';

export const loadTasks = createAction(
  '[Tasks] Load',
  props<{ status?: string; category?: string }>()
);

export const loadTasksSuccess = createAction(
  '[Tasks] Load Success',
  props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks] Load Failure',
  props<{ error: unknown }>()
);

// Create
export const createTask = createAction(
  '[Tasks] Create',
  props<{ dto: Partial<Task> }>()
);

export const createTaskSuccess = createAction(
  '[Tasks] Create Success',
  props<{ task: Task }>()
);

export const createTaskFailure = createAction(
  '[Tasks] Create Failure',
  props<{ error: unknown }>()
);

// Update (partial)
export const updateTask = createAction(
  '[Tasks] Update',
  props<{ id: string; changes: Partial<Task> }>()
);

export const updateTaskSuccess = createAction(
  '[Tasks] Update Success',
  props<{ task: Task }>()
);

export const updateTaskFailure = createAction(
  '[Tasks] Update Failure',
  props<{ error: unknown }>()
);

// Delete
export const deleteTask = createAction(
  '[Tasks] Delete',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  '[Tasks] Delete Failure',
  props<{ error: unknown }>()
);
