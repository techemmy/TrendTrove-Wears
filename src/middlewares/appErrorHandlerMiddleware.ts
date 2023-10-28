import type { NextFunction, Request, Response } from 'express';
import { setFlashMessage } from '../utilities';

export default (
    error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (res.headersSent) {
        next(error);
        return;
    }
    if (typeof error.message === 'string' && error.message.length > 0) {
        setFlashMessage(req, {
            type: 'danger',
            message: error.message,
        });
        res.redirect(req.originalUrl);
        return;
    }
    res.render('error');
};
