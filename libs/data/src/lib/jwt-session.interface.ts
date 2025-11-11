import { Role } from "./role";

export interface JwtSession {
  sub: string; // userId
  email: string;
  orgId: string;
  role: Role; //'OWNER' | 'ADMIN' | 'VIEWER';
}
