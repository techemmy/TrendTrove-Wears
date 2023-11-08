import router, { type Router } from 'express';
import db from '../database';

const adminRouter: Router = router();
const Product = db.products;

adminRouter.get('/', async (req, res) => {
    const products = await Product.findAll();
    res.render('admin/dashboard', { products });
});

export default adminRouter;
