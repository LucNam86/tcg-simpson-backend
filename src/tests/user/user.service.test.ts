// services/user.service.test.ts
import { registerUser } from '@services/user';
 
// Mock des dépendances
jest.mock('@database/methods/user.methods', () => ({
  findUserByEmail: jest.fn(),
  saveUser: jest.fn(),
}));
 
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));
 
import { findByEmail, save } from '@database/methods/user';
 
const mockFindUserByEmail = findByEmail as jest.Mock;
const mockSaveUser = save as jest.Mock;
 
const validInput = {
  pseudo: 'Lulu',
  email: 'lulu@example.com',
  password: 'motdepasse123',
};
 
describe('createUser', () => {
  beforeEach(() => jest.clearAllMocks());
 
  it('crée un user et retourne son id', async () => {
    mockFindUserByEmail.mockResolvedValue({ ok: true, value: null });
    mockSaveUser.mockResolvedValue({ ok: true, value: undefined });
 
    const result = await registerUser(validInput);
 
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBeDefined();
      expect(typeof result.value.id).toBe('string');
    }
  });
 
  it('retourne EMAIL_TAKEN si email déjà pris', async () => {
    mockFindUserByEmail.mockResolvedValue({ ok: true, value: { id: '123' } });
 
    const result = await registerUser(validInput);
 
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('EMAIL_TAKEN');
    expect(mockSaveUser).not.toHaveBeenCalled();
  });
 
  it('retourne USER_CREATION_FAILED si la sauvegarde échoue', async () => {
    mockFindUserByEmail.mockResolvedValue({ ok: true, value: null });
    mockSaveUser.mockResolvedValue({ ok: false, error: 'Erreur lors de la sauvegarde' });
 
    const result = await registerUser(validInput);
 
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('USER_CREATION_FAILED');
  });
 
  it('met l\'email en lowercase avant de sauvegarder', async () => {
    mockFindUserByEmail.mockResolvedValue({ ok: true, value: null });
    mockSaveUser.mockResolvedValue({ ok: true, value: undefined });
 
    await registerUser({ ...validInput, email: 'LULU@EXAMPLE.COM' });
 
    const savedUser = mockSaveUser.mock.calls[0][0];
    expect(savedUser.email).toBe('lulu@example.com');
  });
 
  it('initialise les valeurs par défaut du user', async () => {
    mockFindUserByEmail.mockResolvedValue({ ok: true, value: null });
    mockSaveUser.mockResolvedValue({ ok: true, value: undefined });
 
    await registerUser(validInput);
 
    const savedUser = mockSaveUser.mock.calls[0][0];
    expect(savedUser.money).toBe(100);
    expect(savedUser.myCollection).toEqual([]);
    expect(savedUser.deck).toEqual([]);
    expect(savedUser.darkMode).toBe(false);
    expect(savedUser.avatar).toBe('');
  });
});
 