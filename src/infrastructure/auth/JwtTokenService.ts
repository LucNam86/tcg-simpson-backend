import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthPayload, TokenService } from '@application/ports/TokenService';

function sign(secret: string, issuer: string, expiresIn: string) {
  return function (payload: AuthPayload): Promise<string> {
    return new Promise(function (resolve, reject) {
      jwt.sign(
        payload,
        secret,
        { issuer, expiresIn: expiresIn as SignOptions['expiresIn'] },
        function (err, token) {
          if (err || !token) return reject(err);
          resolve(token);
        },
      );
    });
  };
}

function verify(secret: string, issuer: string) {
  return function (token: string): Promise<AuthPayload> {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, secret, { issuer }, function (err, decoded) {
        if (err || !decoded || typeof decoded === 'string') {
          return reject(new Error('Invalid token'));
        }
        const { userId } = decoded as AuthPayload;
        resolve({ userId });
      });
    });
  };
}

export function makeJwtTokenService(
  secret: string,
  issuer: string,
  expiresIn: string,
): TokenService {
  return {
    sign: sign(secret, issuer, expiresIn),
    verify: verify(secret, issuer),
  };
}