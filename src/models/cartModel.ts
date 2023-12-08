import { DataTypes, Model } from 'sequelize';
import { type CartAttributes } from '../types/models/cartTypes';
import { CART_STATES } from '../constants';

export class Cart extends Model<CartAttributes> implements CartAttributes {
    id: number;
    couponId: number;
    cartTotal: number;
    userId: number;
    state: string;
}

export function cartFactory(sequelize): typeof Cart {
    return Cart.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            cartTotal: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            state: {
                type: DataTypes.ENUM(...Object.values(CART_STATES)),
                defaultValue: CART_STATES.PENDING,
            },
        },
        { sequelize }
    );
}
