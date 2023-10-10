import type { NextFunction, Request, Response } from 'express';
import type {
    IRequestWithSessionObject,
    IRequestWithUserForm,
} from '../types/requestTypes';

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
    req: IRequestWithUserForm,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {

        res.redirect('auth/login');
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
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        res.redirect('auth/login');
    } catch (error) {
        next(error);
    }
}

export function getLogout(
    req: IRequestWithSessionObject,
    res: Response,
    next: NextFunction
): void {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {}
}
