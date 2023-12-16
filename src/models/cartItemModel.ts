import { DataTypes, Model } from 'sequelize';
import { type CartItemAttributes } from '../types/models/cartTypes';
import { PRODUCT_SIZES } from '../constants';

export class CartItem
    extends Model<CartItemAttributes>
    implements CartItemAttributes
{
    id: number;
    size: string;
    quantity: string;
    totalPrice: number;
    productId: number;
    cartId: number;
}

export function cartItemFactory(sequelize): typeof CartItem {
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
                validate: {
                    isIn: {
                        args: [Object.keys(PRODUCT_SIZES)],
                        msg: 'Invalid item size. Select a valid size',
                    },
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: {
                        args: [1],
                        msg: 'Cart item quantity cannot be less than 1',
                    },
                },
            },
            totalPrice: {
                type: DataTypes.FLOAT(4),
                allowNull: false,
            },
        },
        { sequelize }
    );
}
