import { Router } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.redirect('/user/profile');
});

userRouter.get('/profile', (req: IRequestWithAuthenticatedUser, res) => {
    res.render('user/user-profile', { user: req.user });
});

export default userRouter;
