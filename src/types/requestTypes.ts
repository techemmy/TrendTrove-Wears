import type { Request } from 'express';
import type { UserAttributes } from './models/userTypes';

export interface IRequestWithSessionObject extends Request {
    session: any;
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
    isAuthenticated: () => boolean | null;
}

export interface IRequestWithRequiredName {
    body: {
        name: string;
    };
}

export interface IRequestWithFlashMessages extends Request {
    session: {
        flashMessages?: Array<{ type: string; message: string }>;
    };
}

export type IRequestWithUserSignupForm = IRequestWithRequiredName &
    IRequestWithUserForm;
