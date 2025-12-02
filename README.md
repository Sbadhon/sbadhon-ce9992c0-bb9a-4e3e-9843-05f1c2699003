
# Secure Task Management System (NX Monorepo)

Role-based (RBAC) task board with organization scoping, JWT auth, and audit logging.  

## 1. Quick Start – Run Everything Locally
**A working .env is already included at the repo root* 
Note: If you have Docker Desktop installed on your machine, everything should run smoothly without additional configuration.

# Clone: 
```bash
git clone https://github.com/Sbadhon/sbadhon-ce9992c0-bb9a-4e3e-9843-05f1c2699003.git
```
From the **repo root**:
```bash
npm install
npm run db:up
npm run db:migrate
npm run seed
npm run api
npm run dashboard
```
# → http://localhost:4200
## Logins:
  - Owner: owner@turbovets.com / Password123!   
  - Admin: admin@turbovets.com / Password123!
  - Viewer: viewer@turbovets.com / Password123!
The dashboard will store the JWT and automatically attach it via an HTTP interceptor.

**OWNER: full access to org’s resources (read/write/delete).**
**ADMIN: read/write tasks in org; no system-wide privileges.**
**VIEWER: read-only tasks in org.**

Note: If you cloned the repo inside Documents/Desktop/Downloads and using macOS, macOS may block Node from scanning folder and that will cause EPERM problem.
Recommendation:
```bash
mkdir -p ~/dev
cd ~/dev/<project-folder>
```

Endpoints:
POST http://localhost:3000/api/v1/auth/login
body:
```JSON
{"email":"owner@turbovets.com","password":"Password123!"}
```
Response:
```JSON
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMGFmMWJhOS02OWYwLTQ4YjktYjcwYy00NTFmZmViNzdjNDYiLCJlbWFpbCI6Im93bmVyQHR1cmJvdmV0cy5jb20iLCJvcmdJZCI6IjJkZDc4MjQ5LTBlYmUtNDc3YS1hMjI2LTZjN2YwNjE1NDA5OSIsInJvbGUiOiJPV05FUiIsImlhdCI6MTc2NDYzNzM4MywiZXhwIjoxNzY0NjM5MTgzfQ.m-if74JgapeubETfdlvlJGe-se9bpHeHfNQJV9V9oAE",
    "user": {
        "id": "b0af1ba9-69f0-48b9-b70c-451ffeb77c46",
        "email": "owner@turbovets.com"
    },
    "orgId": "2dd78249-0ebe-477a-a226-6c7f06154099",
    "role": "OWNER"
}
```
Use JWT token in all requests
Auth Type : Bearer Token

GET http://localhost:3000/api/v1/tasks

POST http://localhost:3000/api/v1/tasks
Body:
```JSON
{
  "title":"Test Added",
  "description":"testing",
  "category":"WORK",
  "dueDate":"2025-12-01"
}
```

PUT http://localhost:3000/api/v1/tasks/aef96104-ecb5-4b80-97bc-888ab889a385
Body:
```JSON
{
  "title":"Test Edited",
  "description":"test",
  "category":"WORK",
  "status":"TODO",
  "dueDate":"2025-12-01"
}
```
PATCH http://localhost:3000/api/v1/tasks/aef96104-ecb5-4b80-97bc-888ab889a385
Body:
```JSON
{
  "title":"Test Edited-Patch Test",
}
```
DELETE 
http://localhost:3000/api/v1/tasks/aef96104-ecb5-4b80-97bc-888ab889a385

Search by category: (WORK / PERSONAL)
GET http://localhost:3000/api/v1/tasks?category=WORK

Get Adit logs
GET http://localhost:3000/api/v1/audit?userId=b0af1ba9-69f0-48b9-b70c-451ffeb77c46


Repeat for - Admin: admin@turbovets.com / Password123!
- Viewer: viewer@turbovets.com / Password123!
