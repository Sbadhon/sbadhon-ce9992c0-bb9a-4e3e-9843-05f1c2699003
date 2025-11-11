import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from './task.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiBase}/v1/tasks`;

  list(filters?: { status?: string; category?: string }): Observable<Task[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.category) params = params.set('category', filters.category);
    return this.http.get<Task[]>(this.apiBase, { params });
  }

  create(dto: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiBase, dto);
  }

  update(id: string, changes: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiBase}/${id}`, changes);
  }

  remove(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${this.apiBase}/${id}`);
  }
}
