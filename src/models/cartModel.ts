import { DataTypes, Model } from 'sequelize';
import { type CartAttributes } from '../types/models/cartTypes';

class Cart extends Model<CartAttributes> implements CartAttributes {
    id: number;
    couponId: number;
    cartTotal: number;
    userId: number;
}

export default (sequelize): typeof Cart => {
    return Cart.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            couponId: {
                type: DataTypes.INTEGER,
            },
            cartTotal: {
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
            },
        },
        { sequelize }
    );
};