// services/user.service.test.ts
import { registerUser } from '@services/user';

jest.mock('@database/methods/user', () => ({
  findByEmail: jest.fn(),
  save: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

jest.mock('@config/env', () => ({
  env: { BCRYPT_SALT_ROUNDS: 12 },
}));

import { findByEmail, save } from '@database/methods/user';

const mockFindByEmail = findByEmail as jest.Mock;
const mockSave = save as jest.Mock;

const validInput = {
  pseudo: 'Lulu',
  email: 'lulu@example.com',
  password: 'motdepasse123',
};

describe('registerUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crée un user et retourne le PublicUser', async () => {
    mockFindByEmail.mockResolvedValue({ ok: true, value: null });
    mockSave.mockResolvedValue({ ok: true, value: 'abc-123' });

    const result = await registerUser(validInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe('abc-123');
      expect(result.value.pseudo).toBe('Lulu');
      expect(result.value.email).toBe('lulu@example.com');
      expect(result.value.money).toBe(100);
      expect(result.value.avatar).toBe('');
      expect(result.value.myCollection).toEqual([]);
      expect(result.value.decks).toEqual([]);
      expect(result.value.darkMode).toBe(false);
    }
  });

  it('retourne EMAIL_TAKEN si email déjà pris', async () => {
    mockFindByEmail.mockResolvedValue({ ok: true, value: { id: '123' } });

    const result = await registerUser(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('EMAIL_TAKEN');
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('retourne USER_CREATION_FAILED si la sauvegarde échoue', async () => {
    mockFindByEmail.mockResolvedValue({ ok: true, value: null });
    mockSave.mockResolvedValue({ ok: false, error: 'Erreur lors de la sauvegarde' });

    const result = await registerUser(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('USER_CREATION_FAILED');
  });

  it("met l'email en lowercase avant de sauvegarder", async () => {
    mockFindByEmail.mockResolvedValue({ ok: true, value: null });
    mockSave.mockResolvedValue({ ok: true, value: 'abc-123' });

    const result = await registerUser({ ...validInput, email: 'LULU@EXAMPLE.COM' });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.email).toBe('lulu@example.com');
  });

  it('initialise les valeurs par défaut du user', async () => {
    mockFindByEmail.mockResolvedValue({ ok: true, value: null });
    mockSave.mockResolvedValue({ ok: true, value: 'abc-123' });

    await registerUser(validInput);

    const savedUser = mockSave.mock.calls[0][0];
    expect(savedUser.money).toBe(100);
    expect(savedUser.myCollection).toEqual([]);
    expect(savedUser.decks).toEqual([]);
    expect(savedUser.darkMode).toBe(false);
    expect(savedUser.avatar).toBe('');
  });
});