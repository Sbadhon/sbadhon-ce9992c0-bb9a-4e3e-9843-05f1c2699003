import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskCategory, TaskStatus } from '../../state/tasks/task.models';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})

export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() saved = new EventEmitter<Task>();
  @Output() closed = new EventEmitter<void>();

  private fb = new FormBuilder();

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    status: ['To Do' as TaskStatus, Validators.required],
    category: ['Work' as TaskCategory, Validators.required],
    dueDate: ['', Validators.required],
  });

  isEditMode = false;

  taskStatuses = Object.values(TaskStatus);
  taskCategories = Object.values(TaskCategory);

  ngOnInit() {
    const taskData = this.task;
    if (taskData) {
      this.isEditMode = true;
      this.taskForm.patchValue(taskData);
    }
  }

  onSave(): void{
    this.saved.emit(this.taskForm.value as Task);
    this.closed.emit();
  }

  onClose(): void{
    this.closed.emit();
  }
}
