import { dbConfig } from '../config';
import { Sequelize } from 'sequelize';
import {
    UserFactory,
    RoleFactory,
    ProductFactory,
    AddressFactory,
    UserOrderFactory,
    CartItemFactory,
    CartFactory,
    CouponFactory,
} from '../models';

const sequelize = new Sequelize(
    dbConfig.DATABASE,
    dbConfig.USERNAME,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
        pool: {
            min: dbConfig.pool.min,
            max: dbConfig.pool.max,
            idle: dbConfig.pool.idle,
            acquire: dbConfig.pool.acquire,
        },
        define: {
            freezeTableName: true, // prevents Sequelize from auto-pluralization of model names
        },
    }
);

const db = {
    sequelize,
    users: UserFactory(sequelize),
    roles: RoleFactory(sequelize),
    products: ProductFactory(sequelize),
    address: AddressFactory(sequelize),
    userOrder: UserOrderFactory(sequelize),
    cartItem: CartItemFactory(sequelize),
    cart: CartFactory(sequelize),
    coupon: CouponFactory(sequelize),
};

export default db;
