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

    if (error.name === 'TimeoutError' && error.http_code === 499) {
        setFlashMessage(req, {
            type: 'info',
            message: 'You might be experiencing some network issues...',
        });
        res.redirect('back');
        return;
    }

    if (typeof error.message === 'string' && error.message.length > 0) {
        setFlashMessage(req, {
            type: 'danger',
            message: error.message,
        });

        req.session.destroy((err: Error) => {
            if (err !== undefined) {
                next(err);
            }
            res.redirect('back');
        });
        return;
    }
    res.render('error');
};
