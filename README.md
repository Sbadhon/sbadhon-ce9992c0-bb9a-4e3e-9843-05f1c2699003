
Secure Task Management System (NX Monorepo)Role-based (RBAC) task board with organization scoping, JWT auth, and audit logging.
1) Setup Instructions
Prerequisites
Node.js 20+
PNPM or NPM
PostgreSQL 14+ (or Docker)
Mac tip: If you run from a protected folder (e.g., Documents) and hit EPERM with tsconfig-paths, move the project to a dev workspace path (e.g., ~/dev/…).
Environment
Create .env at repo root (used by the API):

# --- DB ---
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASS=postgres
DB_NAME=turbovets

# --- API ---
PORT=3000

# --- JWT ---
JWT_SECRET=super_dev_secret
JWT_EXPIRES_IN=1800
If you prefer Docker for Postgres:

docker run --name turbovets-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres -e POSTGRES_DB=turbovets \
  -p 5433:5432 -d postgres:14
Install

npm install
Database: Run Migrations + Seed

# Build once if needed (to get dist migrations)
npx nx build data
npx nx build auth

# Run migrations automatically on app start
# (app has TypeORM `migrationsRun: true`), or run CLI:
npm run seed 
px ts-node \
  -r ./apps/api/src/register-paths.ts \
  -r reflect-metadata \
  ./apps/api/src/database/data-source.ts migration:run
Seed (creates orgs, users, and sample tasks)

npx nx serve api

# or npm --workspace=apps/api run seed
Start API & UI

# API (NestJS)
npx nx serve api
# → http://localhost:3000/api

# Dashboard (Angular)
npx nx serve  dashboard
# → http://localhost:4200
Test Logins
Owner: owner@turbovets.com / Password123!
Admin: admin@turbovets.com / Password123!
Viewer: viewer@turbovets.com / Password123!
The dashboard will store the JWT and automatically attach it via an HTTP interceptor.

2) Architecture Overview
NX Layout

apps/
  api/        # NestJS backend (Auth, Tasks, Audit)
  dashboard/  # Angular frontend (Auth + Tasks board)
libs/
  data/       # Shared enums, DTOs, interfaces (TaskStatus, RoleEnum, DTOs)
  auth/       # Reusable guards/decorators/ABAC (JwtAuthGuard, RolesGuard, OrgScope)
Key Backend Modules
AuthModule: JWT login, JwtAuthGuard, token validation.
TasksModule: Task CRUD, service-level authorization, audit logging.
AuditModule: AuditService (TASK_CREATE/UPDATE/DELETE) backed by TypeORM.
TypeORM: Postgres entities (User, Organization, Task, AuditLog), migrations.
Key Frontend Pieces
NgRx auth slice for token, role, orgId (hydrated from localStorage).
NgRx tasks slice for list/create/update/delete + effects.
JwtInterceptor attaches Authorization: Bearer <token>.
Task board with DnD and server-backed filtering; chart uses Chart.js.
Tailwind + dark/light toggle.

3) Data Model Explanation
Entities
Organization
id, name, parentId (nullable) – allows 2-level hierarchy (Parent → Child).
User
id, email (unique), passwordHash, orgId, role (OWNER|ADMIN|VIEWER)
Task
id, orgId, createdByUserId, title, description?,status (TODO|IN_PROGRESS|DONE), category? (WORK|PERSONAL),dueDate?, order, createdAt, updatedAt
AuditLog
id, orgId, userId, action (TASK_*), resource, resourceId, meta, createdAt
ERD (simplified)

Organization (1) ────< (N) User
      |                     |
      |                     └────< (N) AuditLog
      └────< (N) Task  ─────────^

4) Access Control Implementation
Roles & Capabilities
OWNER: full access to org’s resources (read/write/delete).
ADMIN: read/write tasks in org; no system-wide privileges.
VIEWER: read-only tasks in org.
Guards & ABAC
@RequireRoles(...) + RolesGuard (ANY-OF semantics): handler requires any of the roles listed.
OrgScopeGuardDefault: if request includes orgId (params/query/body), it must equal JWT orgId. Missing/blank is allowed and defaults to JWT org on server. Stops cross-org access.
Service-layer ABAC (canReadTasks, canWriteTasks): final decision at the service, not just the controller.
JWT Integration
Login returns { accessToken, user, orgId, role }.
Dashboard persists to localStorage (auth.v1); JwtInterceptor attaches the header to all requests.

5) API Docs (Sample Requests)
Base URL: http://localhost:3000/api/v1
Auth
POST /auth/login

curl -s -X POST http://localhost:3000/api/v1/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"owner@turbovets.com","password":"Password123!"}'
Response:

{
  "accessToken": "…",
  "user": { "id": "…", "email": "owner@turbovets.com" },
  "orgId": "…",
  "role": "OWNER"
}
Tasks
All endpoints require Authorization: Bearer <token>
GET /tasks (optional status, category)
If orgId missing/blank, server defaults to JWT org.

curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/tasks?status=IN_PROGRESS"
POST /tasks

curl -s -X POST http://localhost:3000/api/v1/tasks \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"title":"Kickoff Deck","description":"Finalize slides","status":"TODO","category":"WORK","dueDate":"2025-12-31","order":0}'
PATCH /tasks/:id

curl -s -X PATCH http://localhost:3000/api/v1/tasks/<taskId> \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"status":"IN_PROGRESS","order":2}'
DELETE /tasks/:id

curl -s -X DELETE http://localhost:3000/api/v1/tasks/<taskId> \
 -H "Authorization: Bearer $TOKEN"
Audit
GET /audit-log (Owner/Admin only)

curl -s -H "Authorization: Bearer $TOKEN" \
 http://localhost:3000/api/v1/audit-log

6) Frontend Features
Login UI: issues credentials, stores token, redirects to /tasks.
Task Board:
Column view: To Do, In Progress, Done
Server-backed filter by category; no client-only filtering to keep RBAC consistent.
Drag to reorder/move status → calls PATCH with partial DTO (status/order).
Visualization: Chart.js bar chart shows counts per status.
Theme Toggle: dark/light with Tailwind classes.
State: NgRx for auth & tasks; effects coordinate API calls and errors.

7) Testing Strategy -Future Considerations
Backend (Jest)
Auth: login success/failure; token verification guard.
RBAC:
GET /tasks allowed for Owner/Admin/Viewer (same org).
POST/PATCH/DELETE /tasks allowed for Owner/Admin; 403 for Viewer.
Org Guard: requests with foreign orgId → 403.
Service ABAC: unit tests for canReadTasks / canWriteTasks.
Frontend (Jest/Karma)
Auth reducer/effects: login success/failure; hydration from storage.
Tasks effects: load with and without filters; update on DnD.
Components: Task board renders grouped columns; chart updates when tasks change.

8) Future Considerations
Security Hardening
Refresh tokens + short-lived access tokens.
CSRF defense for cookie-based sessions
Rate limiting, IP throttling, login attempt lockouts.
RBAC Extensions
Delegation/impersonation, per-resource permissions, row-level policies.
Caching authorization decisions with invalidation.


9) Rationale (Architecture & Design)
Service-layer RBAC: Guards prevent obvious mistakes; the service remains the final arbiter (defense-in-depth).
Org scoping: Guard plus server-side defaulting to JWT org eliminates FE trust issues.
NX libs (data, auth): Shared enums/DTOs and guards reduce drift across apps.
NgRx: Predictable data flow for auth and tasks; easy to persist/hydrate.
Chart & DnD: Minimal deps, clear abstractions; non-blocking extras that demonstrate polish.
