import type { Request, Response } from 'express';
import db from '../database';
import { cloudinaryAPI, setFlashMessage } from '../utilities';
import { ALLOWED_IMAGE_TYPES } from '../constants';
import DataURIParser from 'datauri/parser';
import path from 'node:path';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
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
    req: IRequestWithAuthenticatedUser,
    res: Response
): Promise<void> {
    console.log(req.body);
    if (req.file === undefined) {
        setFlashMessage(req, {
            type: 'info',
            message: 'No file was detected. Choose a file',
        });
        res.redirect('back');
        return;
    }

    const imageType = req.file.mimetype.split('/').at(-1) ?? '';
    if (!ALLOWED_IMAGE_TYPES.includes(imageType)) {
        setFlashMessage(req, {
            type: 'warning',
            message: `Unallowed file type. Only pictures of "${ALLOWED_IMAGE_TYPES.join(
                ', '
            )}" type are allowed`,
        });
        res.redirect('back');
        return;
    }

    const dUri = new DataURIParser();
    const productImage = dUri.format(
        path.extname(req.file.originalname).toString(),
        req.file.buffer
    ).content;

    const product = await Product.create({
        ...req.body,
        sizes:
            typeof req.body.sizes === 'string'
                ? Array(req.body.sizes)
                : req.body.sizes,
        userId: req.user.id,
    });

    const uploadedImg = await cloudinaryAPI().uploader.upload(
        productImage as string,
        {
            public_id: product.id.toString(),
            overwrite: true,
            folder: '/trendtrove/products',
            resource_type: 'image',
        }
    );
    await product.update({ imageURL: uploadedImg.url });
    setFlashMessage(req, {
        type: 'success',
        message: `${product.name} added succesfully`,
    });
    res.redirect('back');
}

export async function getDeleteProductById(
    req: Request,
    res: Response
): Promise<void> {
    const productId = req.params.productId;
    await Product.destroy({ where: { id: productId } });
    await cloudinaryAPI().uploader.destroy(`trendtrove/products/${productId}`);
    setFlashMessage(req, { type: 'success', message: 'Product deleted!' });
    res.redirect('back');
}
