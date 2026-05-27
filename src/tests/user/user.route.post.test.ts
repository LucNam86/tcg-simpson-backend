// routes/user.test.ts
import request from 'supertest';
import express from 'express';
import userRoutes from '@routes/user/user.post';

// Mock du service
jest.mock('@services/user', () => ({
  registerUser: jest.fn(),
}));

// Mock du middleware JWT
jest.mock('@middleware/jwt.middleware', () => ({
  signToken: jest.fn().mockReturnValue('fake-jwt-token'),
  jwtMiddleware: jest.fn((_req: any, _res: any, next: any) => next()),
}));

import { registerUser } from '@services/index';

const mockCreateUser = registerUser as jest.Mock;

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

const validBody = {
  pseudo: 'Lulu',
  email: 'lulu@example.com',
  password: 'motdepasse123',
};

describe('POST /users/register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('201 - inscrit le user et retourne un token', async () => {
    mockCreateUser.mockResolvedValue({ ok: true, value: { id: 'abc-123' } });

    const res = await request(app)
      .post('/users/register')
      .send(validBody);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token', 'fake-jwt-token');
  });

  it('409 - email déjà pris', async () => {
    mockCreateUser.mockResolvedValue({ ok: false, error: 'EMAIL_TAKEN' });

    const res = await request(app)
      .post('/users/register')
      .send(validBody);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'EMAIL_TAKEN' });
  });

  it('400 - création échouée côté service', async () => {
    mockCreateUser.mockResolvedValue({ ok: false, error: 'USER_CREATION_FAILED' });

    const res = await request(app)
      .post('/users/register')
      .send(validBody);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'USER_CREATION_FAILED' });
  });

  it('400 - payload invalide (email manquant)', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ pseudo: 'Lulu', password: 'motdepasse123' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'EMAIL_INVALID' });
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('400 - pseudo trop court', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ pseudo: 'Lu', email: 'lulu@example.com', password: 'motdepasse123' });

    expect(res.status).toBe(400);
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('400 - password trop court', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ pseudo: 'Lulu', email: 'lulu@example.com', password: '123' });

    expect(res.status).toBe(400);
    expect(mockCreateUser).not.toHaveBeenCalled();
  });
});