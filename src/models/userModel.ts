import { DataTypes, Model } from 'sequelize';
import { type UserAttributes } from '../types/models/userTypes';

export class User extends Model<UserAttributes> implements UserAttributes {
    id: number;
    name: string;
    email: string;
    providerIdentity: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export function userFactory(sequelize): typeof User {
    return User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            providerIdentity: {
                type: DataTypes.STRING,
            },
        },
        { sequelize }
    );
}
