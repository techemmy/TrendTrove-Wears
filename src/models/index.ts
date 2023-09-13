// import sequelize from "../database";
import RoleFactory, { Role } from './roleModel';
import UserFactory, { User } from './userModel';
import ProductFactory, { Product } from './productModel';
import AddressFactory, { Address } from './addressModel';
import UserOrderFactory, { UserOrder } from './userOrderModel';
import CartItemFactory, { CartItem } from './cartItemModel';
import CartFactory, { Cart } from './cartModel';
import CouponFactory, { Coupon } from './couponModel';

export {
    User,
    UserFactory,
    Role,
    RoleFactory,
    Product,
    ProductFactory,
    Address,
    AddressFactory,
    UserOrder,
    UserOrderFactory,
    CartItem,
    CartItemFactory,
    Cart,
    CartFactory,
    Coupon,
    CouponFactory,
};
