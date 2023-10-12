import type { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import type {
    IRequestWithFlashMessages,
    IRequestWithSessionObject,
} from '../types/requestTypes';
import { setFlashMessages } from '../utilities';

export default (
    req: IRequestWithSessionObject & IRequestWithFlashMessages,
    res: Response,
    next: NextFunction
): void => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next();
        return;
    }

    const errors = result.array().map((error) => {
        return { type: 'warning', message: error.msg };
    });
    setFlashMessages(errors, req);
    res.redirect(req.originalUrl);
};
