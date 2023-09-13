import { DataTypes, Model } from 'sequelize';
import { type UserOrderAttributes } from '../types/models/userOrderTypes';

export class UserOrder
    extends Model<UserOrderAttributes>
    implements UserOrderAttributes
{
    id: number;
    cartId: number;
    addressId: number;
    userId: number;
}

export function UserOrderFactory(sequelize): typeof UserOrder {
    return UserOrder.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            cartId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            addressId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        { sequelize }
    );
}
