import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from '../constants';
import db from '../database';

const Product = db.products;

export async function getDashboard(req, res): Promise<void> {
    const products = await Product.findAll();

    res.render('admin/dashboard', {
        products,
        productCategories: PRODUCT_CATEGORIES,
        productSizes: PRODUCT_SIZES,
    });
}
