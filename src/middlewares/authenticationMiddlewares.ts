import type { NextFunction, Request, Response } from 'express';
import { setFlashMessage } from '../utilities';

export function ensureLoggedIn(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (req.user === undefined) {
        setFlashMessage(req, {
            type: 'info',
            message: 'You need to login to continue',
        });
        res.redirect('/auth/login');
        return;
    }
    next();
}
