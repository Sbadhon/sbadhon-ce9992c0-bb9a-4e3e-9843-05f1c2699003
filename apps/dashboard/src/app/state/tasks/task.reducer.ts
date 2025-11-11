import { createReducer, on } from '@ngrx/store';
import * as TaskActions from './task.actions';
import { Task } from './task.models';

export const TASKS_FEATURE_KEY = 'tasks';

export interface TasksState {
  items: Task[];
  loading: boolean;
  error: unknown | null;
}

const initial: TasksState = {
  items: [],
  loading: false,
  error: null,
};

export const tasksReducer = createReducer(
  initial,

  // Load
  on(TaskActions.loadTasks, state => ({ ...state, loading: true, error: null })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state, items: tasks, loading: false
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Create
  on(TaskActions.createTaskSuccess, (state, { task }) => ({
    ...state, items: [task, ...state.items]
  })),
  on(TaskActions.createTaskFailure, (state, { error }) => ({
    ...state, error
  })),

  // Update
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    items: state.items.map(t => (t.id === task.id ? task : t)),
  })),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state, error
  })),

  // Delete
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    items: state.items.filter(t => t.id !== id),
  })),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state, error
  })),
);
