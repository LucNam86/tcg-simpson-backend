import { Router } from 'express';
import { TokenService } from '@application/ports/TokenService';
import { createRegisterUserUseCase } from '@application/useCases/user/registerUser';
import { UserRepository, PasswordHasher } from '@domain/user';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { RegisterUserSchema } from '@shared/index'

type UserRoutesInputs = {
  tokenService: TokenService;
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
};

export const userRoutes = ({ tokenService,userRepository, passwordHasher }: UserRoutesInputs) => {
  const router = Router();

  //A ajouter à toutes les routes de ce router : req.user = AuthPayload | undefined
  const auth = jwtAuthMiddleware(tokenService);

  const registerUser = createRegisterUserUseCase({ userRepository, passwordHasher });


 router.post('/register', async (req, res) => {
    const body = RegisterUserSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: 'EMAIL_INVALID' });

    const result = await registerUser.execute(body.data);
    if (!result.ok) {
      if (result.error === 'EMAIL_TAKEN') return res.status(409).json({ error: result.error });
      return res.status(400).json({ error: result.error });
    }

    const token = await tokenService.sign({ id: result.value.id });
    return res.status(201).json({ message: 'User created', token });
  });

  return router;
};