import { Optional } from "sequelize"

export interface UserAttributes {
    id?: number,
    email: string,
    providerIdentity: string
    createdAt?: Date
    updatedAt?: Date
}