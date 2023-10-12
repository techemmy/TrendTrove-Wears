import type { NextFunction, Request, Response } from 'express';
import type {
    IRequestWithAuthenticatedUser,
    IRequestWithUserForm,
    IRequestWithUserSignupForm,
} from '../types/requestTypes';
import { User } from '../models';
import { matchedData } from 'express-validator';
import { setFlashMessages } from '../utilities';

export function getSignup(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        res.render('auth/signup');
    } catch (error) {
        next(error);
    }
}

export async function postSignup(
    req: IRequestWithUserSignupForm,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (req.isAuthenticated()) {
            res.redirect('/shop');
            return;
        }

        const { name, email, password } = matchedData(req);
        const newAccount = (
            await User.findOrCreate({
                where: {
                    email,
                },
                defaults: {
                    name,
                    email,
                    password,
                },
            })
        ).at(-1) as boolean;

        if (!newAccount) {
            setFlashMessages(req, [
                { type: 'danger', message: 'User account exists!' },
            ]);
            res.redirect('/auth/login');
            return;
        }

        setFlashMessages(req, [
            {
                type: 'success',
                message: `Account created!. We've reserved a space for you in our store :) `,
            },
        ]);
        res.redirect('/auth/login');
    } catch (error) {
        next(error);
    }
}

export function getLogin(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        res.render('auth/login');
    } catch (error) {
        next(error);
    }
}

export function postLogin(
    req: IRequestWithUserForm,
    res: Response,
    next: NextFunction
): void {
    try {
        const { email, password } = matchedData(req.body);

        console.log(email, password);
        res.redirect('/auth/login');
    } catch (error) {
        next(error);
    }
}

export function getLogout(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): void {
    try {
        req.session.destroy((err: Error) => {
            if (err !== undefined) {
                next(err);
            }
            res.redirect('/');
        });
    } catch (error) {}
}
