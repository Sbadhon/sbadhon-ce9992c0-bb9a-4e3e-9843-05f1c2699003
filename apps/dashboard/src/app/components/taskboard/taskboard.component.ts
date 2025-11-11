import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { Task, TaskCategory, TaskCategoryLabel, TaskStatus, TaskStatusLabel } from '../../state/tasks/task.models';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { NgIconsModule } from '@ng-icons/core';
import { ThemeService } from '../../service/theme.service';
import { Store } from '@ngrx/store';
import * as TaskActions from '../../state/tasks/task.actions';
import * as TaskSelectors from '../../state/tasks/task.selectors';
import { TaskChartComponent } from '../task-chart/task-chart.component';
import { HasRoleDirective } from '../../directives/role-derective';
import { AuditLogComponent } from '../audit-log/audit-log.component';

@Component({
  selector: 'app-taskboard',
  standalone: true,
  templateUrl: './taskboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DragDropModule,
    TaskCardComponent,
    TaskFormComponent,
    HasRoleDirective,
    TaskChartComponent,
    AuditLogComponent,
    NgIconsModule,
  ],
})
export class TaskboardComponent {
  private store = inject(Store);
  themeService = inject(ThemeService);

  taskStatuses = Object.values(TaskStatus);
  taskCategories = Object.values(TaskCategory);
  TaskStatusLabel = TaskStatusLabel;
  TaskCategoryLabel = TaskCategoryLabel;
  selectedCategory = signal<TaskCategory | 'All'>('All');
  sortBy = signal<'priority' | 'dueDate'>('priority');
  isModalOpen = signal(false);
  editingTask = signal<Task | null>(null);
  showChart = signal(false);
  showAuditLog = signal(false);

  allTasks = this.store.selectSignal(TaskSelectors.selectAllTasks);
  loading = this.store.selectSignal(TaskSelectors.selectTasksLoading);
  error = this.store.selectSignal(TaskSelectors.selectTasksError);

  tasksByStatus = computed(() => {
    const tasks = this.allTasks();
    return this.taskStatuses.reduce((acc, status) => {
      acc[status] = tasks
        .filter(task => task.status === status)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  });

  constructor() {
    effect(() => {
       this.store.dispatch(TaskActions.loadTasks({}));
    });
  }

  setFilterCategory(value: string) {
    const category = (value as TaskCategory | 'All');
    this.selectedCategory.set(category);
    this.store.dispatch(TaskActions.loadTasks({
      category: category === 'All' ? undefined : category,
    }));
  }

  getTasksForStatus(status: TaskStatus): Task[] {
    return this.tasksByStatus()[status] || [];
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      const items = [...event.container.data];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      this.updateTaskOrders(items);
    } else {
      const newStatus = event.container.id as TaskStatus;
      const movedTask = event.previousContainer.data[event.previousIndex];
      this.store.dispatch(
        TaskActions.updateTask({
          id: movedTask.id,
          changes: { status: newStatus }
        })
      );
    }
  }

  private updateTaskOrders(tasks: Task[]) {
    tasks.forEach((task, index) => {
      if ((task.order ?? 0) !== index) {
        this.store.dispatch(
          TaskActions.updateTask({
            id: task.id,
            changes: { order: index }
          })
        );
      }
    });
  }

  onEditTask(task: Task) {
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  onDeleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TaskActions.deleteTask({ id: taskId }));
    }
  }

  openNewTaskModal() {
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  onModalClose() {
    this.isModalOpen.set(false);
    this.editingTask.set(null);
  }

  onSaveTask(task: Task) {
    const editing = this.editingTask();
    if (editing) {
      this.store.dispatch(
        TaskActions.updateTask({
          id: editing.id,
          changes: {
            title: task.title,
            description: task.description ?? null,
            category: task.category ?? undefined,
            status: task.status,
            dueDate: task.dueDate ?? null,
            order: task.order,
          },
        })
      );
    } else {
      this.store.dispatch(
        TaskActions.createTask({
          dto: {
            title: task.title,
            description: task.description ?? null,
            category: task.category ?? undefined,
            dueDate: task.dueDate ?? null
          },
        })
      );
    }
    this.onModalClose();
  }

  toggleChart() {
    this.showChart.update(v => !v);
  }


  toggleAuditLog() {
    this.showAuditLog.update(v => !v);
  }
}
