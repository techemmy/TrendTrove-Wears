import { Op } from 'sequelize';
import { CART_STATES, PRODUCT_CATEGORIES, PRODUCT_SIZES } from '../constants';
import db from '../database';
import { getPagination } from '../utilities';

const Product = db.products;
const User = db.users;
const Cart = db.carts;

export async function getDashboard(req, res): Promise<void> {
    const { limit, offset, currentPage } = getPagination(1, parseInt(''));
    const products = await Product.findAll({ limit, offset, order: [['updatedAt', 'DESC']] });
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
        currentPage: 1,
        productCategories: PRODUCT_CATEGORIES,
        productSizes: PRODUCT_SIZES,
        totalUsers: totalUsers ?? 0,
        currentMonthRevenue: currentMonthRevenue ?? 0,
        currentWeekOrders: currentWeekOrders ?? 0,
        qAdminSearchProductName: '',
    });
}

export async function getDashboardProducts(req, res, next) {
   try {
        const { page, size } = req.query;
        const qAdminSearchProductName = req.query.qAdminSearchProductName ?? '';
        const { limit, offset, currentPage } = getPagination(
            parseInt(page),
            parseInt('')
        );
        
        const products = await Product.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${qAdminSearchProductName}%`,
                },
            },
            limit,
            offset,
            order: [['updatedAt', 'DESC']]
        });
                
        res.render('admin/table-products.ejs', { products, currentPage, qAdminSearchProductName  });
   } catch (err) {
       console.log(err);
        next();
        
   }
}


