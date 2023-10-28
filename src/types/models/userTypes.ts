export interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    profileImageURL?: string;
    providerIdentity?: string;
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
