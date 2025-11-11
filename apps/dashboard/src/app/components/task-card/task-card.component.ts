import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../state/tasks/task.models';
import { NgIconsModule } from '@ng-icons/core';
import { HasRoleDirective } from '../../directives/role-derective';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, NgIconsModule, HasRoleDirective],
  templateUrl: './task-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input() task!: Task; 

  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();
}
