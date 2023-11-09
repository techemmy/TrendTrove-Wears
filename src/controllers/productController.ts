import type { Request, Response } from 'express';
import db from '../database';
import { setFlashMessage } from '../utilities';
const Product = db.products;

export async function getAllProduct(
    req: Request,
    res: Response
): Promise<void> {
    const products = await Product.findAll();
    res.render('shop', { products });
}

export async function getProductById(
    req: Request,
    res: Response
): Promise<void> {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (product === null) {
        setFlashMessage(req, {
            message: `Product doesn't exist`,
            type: 'info',
        });
        res.redirect('/products');
        return;
    }

    res.render('single-product', { product });
}

export async function postCreateProduct(
    req: Request,
    res: Response
): Promise<void> {
    const product = req.body;
    console.log('Product', product);
    res.redirect(req.originalUrl);
}
