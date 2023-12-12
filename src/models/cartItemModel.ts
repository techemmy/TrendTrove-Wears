import { DataTypes, Model } from 'sequelize';
import { type CartItemAttributes } from '../types/models/cartTypes';

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
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            totalPrice: {
                type: DataTypes.FLOAT(4),
                allowNull: false,
            },
        },
        { sequelize }
    );
}
