export interface UserLite { id: string; email: string; }
export type Role = 'OWNER' | 'ADMIN' | 'VIEWER';

export interface AuthPayload {
  accessToken: string;
  user: UserLite;
  orgId: string;
  role: Role;
}

export enum Status {
  Idle = 'idle',
  Authenticating = 'authenticating',
  Authenticated = 'authenticated',
  Error = 'error'
}

export interface AuthState {
  token: string | null;
  user: UserLite | null;
  orgId: string | null;
  role: Role | null;
  status: Status;
  error?: string | null;
}


export interface JwtSession {
  userId: string; 
  email: string;
  orgId: string;
  role: Role; //'OWNER' | 'ADMIN' | 'VIEWER';
}
