import { Optional } from "sequelize"

export interface RoleAttributes {
    id?: number
    name: string
    permissions: number
}
