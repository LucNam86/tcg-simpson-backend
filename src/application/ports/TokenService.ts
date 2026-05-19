export interface AuthPayload {
    userId: string;
    roles: string[];
  }
  
  export interface TokenService {
    sign(payload: AuthPayload): Promise<string>;
    verify(token: string): Promise<AuthPayload>;
  }