import {
    DataTypes,
    type HasManyCreateAssociationMixin,
    Model,
    type HasManyGetAssociationsMixin,
} from 'sequelize';
import type {
    CartItemAttributes,
    CartAttributes,
} from '../types/models/cartTypes';
import { CART_STATES } from '../constants';
import { type CartItem } from '.';

export class Cart extends Model<CartAttributes> implements CartAttributes {
    id: number;
    couponId: number;
    cartTotal: number;
    userId: number;
    state: string;
    // TODO: add date properties to all models
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    CartItems: CartItemAttributes[];
    createCartItem: HasManyCreateAssociationMixin<CartItem>;
    getCartItems: HasManyGetAssociationsMixin<CartItem>;
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
                type: DataTypes.FLOAT(4),
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
