import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthPayload } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private readonly apiBase = `${environment.apiBase}/v1/auth`;

  login(
    email: string,
    password: string
  ): Observable<AuthPayload> {
    console.log(email, password)
    return this.http.post<AuthPayload>(`${this.apiBase}/login`, {
      email,
      password
    });
  }
}
