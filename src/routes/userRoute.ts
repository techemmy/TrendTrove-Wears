import { Router } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';

const userRouter = Router();

userRouter.get('/', (req: IRequestWithAuthenticatedUser, res) => {
    res.render('user/user-profile', { user: req.user });
});

export default userRouter;
