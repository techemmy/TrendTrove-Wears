export enum UserRoleEnum {
    admin = 'admin',
    customer = 'customer',
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
