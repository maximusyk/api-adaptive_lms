import { Router } from 'express';

import UserController from './user.controller';
import { userValidator } from './user.validator';

const { login, create, getAll, getOne, remove, update } = UserController;

const userRouter = Router();
const authRouter = Router();

authRouter.post('/login', userValidator.login, login);
userRouter.post('/', create);
userRouter.get('/:id', getOne);
userRouter.patch('/:id', update);
userRouter.delete('/:id', remove);
userRouter.get('/', getAll);

export default { authRouter, userRouter };