import router, { type Router } from 'express';
import db from '../database';

const productRouter: Router = router();
const Product = db.products;

productRouter.get('/', (req, res) => {
    res.redirect('/shop/products');
});

productRouter.get('/products', async (req, res) => {
    const products = await Product.findAll();
    res.render('shop', { products });
});

export default productRouter;
