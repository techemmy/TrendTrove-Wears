import { dbConfig } from '../config';
import { Sequelize } from 'sequelize';
import {
    userFactory,
    roleFactory,
    productFactory,
    addressFactory,
    cartItemFactory,
    cartFactory,
    couponFactory,
    User,
    Role,
    Product,
    Cart,
    Address,
    CartItem,
    Coupon,
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
        logging: false,
    }
);

const db = {
    sequelize,
    users: userFactory(sequelize),
    roles: roleFactory(sequelize),
    products: productFactory(sequelize),
    address: addressFactory(sequelize),
    cartItem: cartItemFactory(sequelize),
    cart: cartFactory(sequelize),
    coupon: couponFactory(sequelize),
};

// MODEL RELATIONSHIPS
// User <=> Role
User.belongsToMany(Role, { through: 'userRoles' });
Role.belongsToMany(User, { through: 'userRoles' });

// User <=> Product
User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });

// User <=> Cart
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// User <=> Address
User.hasOne(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

// Product <=> CartItem
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

// Cart <=> CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// Coupon <=> Cart
Coupon.hasMany(Cart, { foreignKey: 'couponId' });
Cart.belongsTo(Coupon, { foreignKey: 'couponId' });

export default db;
