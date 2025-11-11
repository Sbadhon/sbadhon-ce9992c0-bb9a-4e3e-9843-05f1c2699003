import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  signal,
  effect,
  input,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  ChartDataset,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Task, TaskStatus } from '../../state/tasks/task.models';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-task-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  /** Use an input signal so changes trigger effects */
  allTasks = input<Task[]>([]);

  private chart!: Chart<'bar', number[], string>;
  private chartReady = signal(false);

  private updateChart = effect(() => {
    const ready = this.chartReady();
    const tasks = this.allTasks();
    if (!ready || !this.chart) return;

    const counts: Record<TaskStatus, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };

    for (const t of tasks) {
      if (t?.status && counts[t.status] !== undefined) counts[t.status]++;
    }

    const dataset: ChartDataset<'bar', number[]> = {
      label: 'Tasks',
      data: [counts.TODO, counts.IN_PROGRESS, counts.DONE],
      backgroundColor: ['#f87171', '#fbbf24', '#4ade80'],
    };

    this.chart.data.labels = ['To Do', 'In Progress', 'Done'];
    this.chart.data.datasets = [dataset];
    this.chart.update();
  }, { allowSignalWrites: true });

  ngAfterViewInit(): void {
    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [
          {
            label: 'Tasks',
            data: [0, 0, 0],
            backgroundColor: ['#f87171', '#fbbf24', '#4ade80'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        maintainAspectRatio: false,
      },
    };

    this.chart = new Chart(this.canvas.nativeElement, config);
    this.chartReady.set(true);
  }

  ngOnDestroy(): void {
    try {
      this.chart?.destroy();
    } catch { /* empty */ }
  }
}
