import type { Request } from 'express';
import type { UserAttributes } from './models/userTypes';
import type { Session } from 'express-session';

export interface IRequestWithSessionObject extends Request {
    session: Session;
}

export interface IRequestWithAuthenticatedUser
    extends IRequestWithSessionObject {
    user: UserAttributes;
    isAuthenticated: () => boolean;
}

export interface IRequestWithUserForm extends Request {
    body: {
        name?: string;
        email: string;
        password: string;
        confirmPassword?: string;
    };
    user?: UserAttributes;
    isAuthenticated: () => boolean;
}

export interface IRequestWithRequiredName {
    body: {
        name: string;
    };
}

export interface FlashMessages {
    session: {
        flashMessages?: Array<{ type: string; message: string }>;
    };
}
export type IRequestWithFlashMessages = Request & FlashMessages;

export type IRequestWithUserSignupForm = IRequestWithRequiredName &
    IRequestWithUserForm;
