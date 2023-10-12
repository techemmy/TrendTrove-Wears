/* eslint-disable @typescript-eslint/no-misused-promises */
import router from 'express';
import type { Router } from 'express';
import passport from 'passport';
import googleAuthStrategyMiddleware from '../middlewares/googleAuthStrategyMiddleware';
import * as authController from '../controllers/authController';
import { body } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';

const authRouter: Router = router();

googleAuthStrategyMiddleware();

authRouter.get('/signup', authController.getSignup);
authRouter.post(
    '/signup',
    [
        body('name', 'Name is invalid or empty').trim().notEmpty(),
        body('email', 'Email is invalid or empty')
            .trim()
            .escape()
            .notEmpty()
            .isEmail(),
        body('password', 'Password is invalid or empty').escape().notEmpty(),
        body(
            'confirmPassword',
            'Confirm Password must match the password field'
        ).custom((value, { req }) => {
            return value === req.body.password;
        }),
    ],
    validationErrorHandlerMiddleware,
    authController.postSignup
);

authRouter.get('/login', authController.getLogin);
authRouter.post(
    '/login',
    [
        body('email', 'Email is invalid or empty')
            .trim()
            .escape()
            .notEmpty()
            .isEmail(),
        body('password', 'Password is invalid or empty').escape().notEmpty(),
    ],
    validationErrorHandlerMiddleware,
    authController.postLogin
);

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
