import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.render('user/user-profile');
});

export default userRouter;
