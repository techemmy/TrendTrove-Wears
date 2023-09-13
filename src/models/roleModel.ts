import { Model, DataTypes } from 'sequelize';
import { type RoleAttributes } from '../types/models/roleTypes';

export class Role extends Model<RoleAttributes> implements RoleAttributes {
    id: number;
    name: string;
    permissions: number;
}

export default (sequelize): typeof Role => {
    return Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            permissions: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        { sequelize }
    );
};
