import { dbConfig } from '../config';
import { Sequelize } from 'sequelize';
import {
    User,
    Role,
    Product,
    Address,
    UserOrder,
    CartItem,
    Cart,
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
    users: User(sequelize),
    roles: Role(sequelize),
    products: Product(sequelize),
    address: Address(sequelize),
    userOrder: UserOrder(sequelize),
    cartItem: CartItem(sequelize),
    cart: Cart(sequelize),
};

export default db;
