import type { AddressAttributes } from './addressTypes';

export enum UserRoleEnum {
    Admin = 'admin',
    Customer = 'customer',
}

export interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    profileImageURL?: string;
    providerIdentity?: string;
    role?: UserRoleEnum;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    profileImageURL?: string;
    Address?: AddressAttributes;
}
