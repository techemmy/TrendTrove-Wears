export interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    password?: string;
    phoneNumber?: number;
    profileImage?: string;
    providerIdentity?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
}
