/* eslint-disable @typescript-eslint/no-misused-promises */
import router from 'express';
import type { Router } from 'express';
import passport from 'passport';
import googleAuthStrategyMiddleware from '../middlewares/googleAuthStrategyMiddleware';
import * as authController from '../controllers/authController';
import { body } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import passportLoginStrategyMiddleware from '../middlewares/passportLoginStrategyMiddleware';
import { IUser, UserAttributes } from '../types/models/userTypes';

const authRouter: Router = router();

googleAuthStrategyMiddleware();
passportLoginStrategyMiddleware();

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, user);
    });
});

passport.deserializeUser(function (userData: UserAttributes, cb) {
    process.nextTick(function () {
        const user: IUser = {
            id: userData.id as number,
            name: userData.name,
            email: userData.email,
        };
        cb(null, user);
    });
});

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
    passport.authenticate('local', {
        failureRedirect: '/auth/login',
        successRedirect: '/shop',
    })
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
