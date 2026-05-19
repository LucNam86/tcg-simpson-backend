export interface AuthPayload {
    userId: string;
  }
  
  export interface TokenService {
    sign(payload: AuthPayload): Promise<string>;
    verify(token: string): Promise<AuthPayload>;
  }