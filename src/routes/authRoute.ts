import router from 'express';
import type { Router } from 'express';
import passport from 'passport';
import googleAuthStrategyMiddleware from '../middlewares/googleAuthStrategyMiddleware';
import * as authController from '../controllers/authController';

const authRouter: Router = router();

googleAuthStrategyMiddleware();

authRouter.get('/signup', authController.getSignup);

authRouter.get('/login', authController.getLogin);

authRouter.post('/signup', authController.postSignup);

authRouter.get('/logout', authController.getLogout);

authRouter.get(
    '/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/shop',
        failureRedirect: '/auth/signup',
    })
);

export default authRouter;
