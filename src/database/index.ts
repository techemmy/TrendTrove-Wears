import { dbConfig } from '../config';
import { Sequelize } from 'sequelize';
import {
    UserFactory,
    RoleFactory,
    ProductFactory,
    AddressFactory,
    CartItemFactory,
    CartFactory,
    CouponFactory,
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
    }
);

const db = {
    sequelize,
    users: UserFactory(sequelize),
    roles: RoleFactory(sequelize),
    products: ProductFactory(sequelize),
    address: AddressFactory(sequelize),
    cartItem: CartItemFactory(sequelize),
    cart: CartFactory(sequelize),
    coupon: CouponFactory(sequelize),
};

// MODEL RELATIONSHIPS
// User <=> Role
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

// User <=> Product
User.hasMany(Product);
Product.belongsTo(User);

// User <=> Cart
User.hasMany(Cart);
Cart.belongsTo(User);

// User <=> Address
User.hasOne(Address);
Address.belongsTo(User);

// Product <=> CartItem
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

// Cart <=> CartItem
Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

// Cart <=> Address
Cart.hasOne(Address);
Address.belongsTo(Cart);

// Coupon <=> Cart
Coupon.hasMany(Cart);
Cart.belongsTo(Coupon);

export default db;
