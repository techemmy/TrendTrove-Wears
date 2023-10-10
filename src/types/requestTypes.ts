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
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    user?: UserAttributes;
    isAuthenticated: () => boolean | null;
}
