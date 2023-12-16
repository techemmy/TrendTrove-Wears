import { Op } from 'sequelize';
import { CART_STATES, PRODUCT_CATEGORIES, PRODUCT_SIZES } from '../constants';
import db from '../database';

const Product = db.products;
const User = db.users;
const Cart = db.carts;

export async function getDashboard(req, res): Promise<void> {
    const products = await Product.findAll({ order: [['updatedAt', 'DESC']] });
    const totalUsers = await User.count();

    let now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const offsetInMilliseconds = Math.abs(offsetInMinutes) * 60000;
    now = new Date(now.getTime() + offsetInMilliseconds);

    const oneWeekInSecs = 1000 * 60 * 60 * 24 * 7;
    const oneWeekAgo = new Date(now.getTime() - oneWeekInSecs);

    const currentMonthRevenue = await Cart.sum('cartTotal', {
        where: {
            state: CART_STATES.DELIVERED,
            updatedAt: {
                [Op.lte]: now,
                [Op.gt]: new Date(oneWeekAgo),
            },
        },
    });
    const currentWeekOrders = await Cart.count({
        where: {
            state: CART_STATES.DELIVERED,
            updatedAt: {
                [Op.lte]: now,
                [Op.gt]: new Date(oneWeekAgo),
            },
        },
    });

    res.render('admin/dashboard', {
        products,
        productCategories: PRODUCT_CATEGORIES,
        productSizes: PRODUCT_SIZES,
        totalUsers: totalUsers ?? 0,
        currentMonthRevenue: currentMonthRevenue ?? 0,
        currentWeekOrders: currentWeekOrders ?? 0,
    });
}
