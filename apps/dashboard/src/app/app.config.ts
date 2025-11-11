import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { AuthEffects } from './state/auth/auth.effects';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtInterceptor } from './core/interceptor/auth.interceptor';
import {
  AUTH_FEATURE_KEY,
  authReducer,
  metaReducers,
} from './state/auth/auth.reducer';
import { TaskEffects } from './state/tasks/task.effects';
import { TASKS_FEATURE_KEY, tasksReducer } from './state/tasks/task.reducer';
import { provideIcons } from '@ng-icons/core';
import { heroArrowRightOnRectangle, heroCheckCircle, heroMoon, heroPlus, heroSun,heroTrash, heroPencil, heroChartBar, heroArrowsPointingOut, heroClock } from '@ng-icons/heroicons/outline'; 
import { AuditLogEffects } from './state/audit-log/audit-log.effects';
import { AUDIT_LOG_FEATURE_KEY, auditLogReducer } from './state/audit-log/audit-log.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideIcons({ heroMoon, heroSun, heroCheckCircle, heroPlus, heroArrowRightOnRectangle, heroTrash, heroPencil, heroChartBar, heroArrowsPointingOut, heroClock }),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideStore({ 
        [AUTH_FEATURE_KEY]: authReducer,
        [TASKS_FEATURE_KEY]: tasksReducer,
        [AUDIT_LOG_FEATURE_KEY]: auditLogReducer
      },     
      { metaReducers }
    ),
    provideEffects([
      AuthEffects,
      TaskEffects,
      AuditLogEffects
    ]),
    provideRouterStore(),
    isDevMode()
      ? provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
      : [],
  ],
};
