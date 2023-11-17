import type { NextFunction, Request, Response } from 'express';
import db from '../database';
import {
    cloudinaryAPI,
    convertBufferToImageURI,
    setFlashMessage,
} from '../utilities';
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from '../constants';
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
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (req.file === undefined) {
            setFlashMessage(req, {
                type: 'info',
                message: 'No file was detected. Choose a file',
            });
            res.redirect('back');
            return;
        }

        const product = await Product.create({
            ...req.body,
            sizes:
                typeof req.body.sizes === 'string'
                    ? Array(req.body.sizes)
                    : req.body.sizes,
            userId: req.user.id,
        });

        const productImage = convertBufferToImageURI(
            req.file.originalname,
            req.file?.buffer
        );
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
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function getUpdateProductById(req, res): Promise<void> {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    res.render('admin/update-product.ejs', {
        product,
        PRODUCT_CATEGORIES,
        PRODUCT_SIZES,
    });
}

export async function postUpdateProductById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { productId } = req.params;
        const updateData = {
            ...req.body,
            sizes:
                typeof req.body.sizes === 'string'
                    ? Array(req.body.sizes)
                    : req.body.sizes,
        };

        if (req.file !== undefined) {
            const productImage = convertBufferToImageURI(
                req.file.originalname,
                req.file.buffer
            );
            const uploadedImg = await cloudinaryAPI().uploader.upload(
                productImage as string,
                {
                    public_id: productId,
                    overwrite: true,
                    folder: '/trendtrove/products',
                    resource_type: 'image',
                }
            );
            updateData.imageURL = uploadedImg.url;
        }

        await Product.update(updateData, {
            where: {
                id: productId,
            },
        });

        setFlashMessage(req, {
            type: 'success',
            message: 'Product updated succesfully',
        });
        res.redirect('back');
    } catch (error) {
        console.log(error);
        if (error.message !== undefined) {
            next(error);
        } else if (error?.error !== undefined) {
            next(error.error);
        }
    }
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
