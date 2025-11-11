import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TaskActions from './task.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { TaskApi } from './tasks.api';
import { Store } from '@ngrx/store';

@Injectable()
export class TaskEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(TaskApi);
  private readonly store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap((action) => {
        const params: { status?: string; category?: string } = {};
        if (action.status) params.status = action.status;
        if (action.category) params.category = action.category;
  
        return this.api.list(params).pipe(
          map(tasks => TaskActions.loadTasksSuccess({ tasks })),
          catchError(error => of(TaskActions.loadTasksFailure({ error })))
        );
      })
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      mergeMap(({ dto }) =>
        this.api.create(dto).pipe(
          map(task => TaskActions.createTaskSuccess({ task })),
          catchError(error => of(TaskActions.createTaskFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ id, changes }) =>
        this.api.update(id, changes).pipe(
          map(task => TaskActions.updateTaskSuccess({ task })),
          catchError(error => of(TaskActions.updateTaskFailure({ error })))
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.api.remove(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError(error => of(TaskActions.deleteTaskFailure({ error })))
        )
      )
    )
  );
}
