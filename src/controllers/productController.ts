import type { Request, Response } from 'express';
import db from '../database';
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
    res.send(product);
}
