import { DataTypes, Model } from 'sequelize';
import { type CartItemAttributes } from '../types/models/cartTypes';

class CartItem extends Model<CartItemAttributes> implements CartItemAttributes {
    id: number;
    size: string;
    quantity: string;
    color: string;
    totalPrice: number;
    productId: number;
    cartId: number;
}

export default (sequelize): typeof CartItem => {
    return CartItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            size: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            color: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            totalPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            cartId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        { sequelize }
    );
};