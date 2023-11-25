import type { NextFunction, Request, Response } from 'express';
import db from '../database';
import {
    cloudinaryAPI,
    convertBufferToImageURI,
    getProductCategoriesCount,
    getPagination,
    setFlashMessage,
    getProductSizesCount,
} from '../utilities';
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from '../constants';
import type {
    IRequestWithAuthenticatedUser,
    IRequestWithGetAllProductsController,
} from '../types/requestTypes';
import { Op } from 'sequelize';
import type { CategoryCount, SizesCount } from '../types/models/productTypes';
const Product = db.products;

// TODO: add try/catch to handle unexpected errors

export async function getAllProducts(
    req: IRequestWithGetAllProductsController,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const queryData: Record<string, string | object> = {};

        const { page, size, category, latest } = req.query;
        const { limit, offset, currentPage } = getPagination(
            parseInt(page),
            parseInt(size)
        );

        let { orderBy, sortBy } = req.query;
        orderBy = orderBy ?? 'DESC';
        sortBy = sortBy ?? 'updatedAt';

        const { priceMin, priceMax } = req.query;
        let { productSizes } = req.query;

        if (category !== undefined) {
            queryData.category = category;
        }

        if (priceMin !== undefined && priceMax !== undefined) {
            queryData.price = {
                [Op.gte]: priceMin,
                [Op.lte]: priceMax,
            };
        }

        if (productSizes !== undefined) {
            productSizes =
                typeof productSizes === 'string'
                    ? [productSizes]
                    : productSizes;
            queryData.sizes = {
                [Op.overlap]: productSizes,
            };
        }

        const { count: totalNoOfProducts, rows: products } =
            await Product.findAndCountAll({
                where: queryData,
                limit,
                offset,
                order: [[sortBy, orderBy]],
            });
        const totalNoOfPages = Math.ceil(totalNoOfProducts / limit);

        const categoryGroupCount = (await Product.count({
            where: {
                category: {
                    [Op.or]: PRODUCT_CATEGORIES,
                },
            },
            group: ['category'],
        })) as unknown as CategoryCount[];
        const sizesGroupCount = (await Product.count({
            where: {
                sizes: {
                    [Op.or]: Object.keys(PRODUCT_SIZES).map((size) => [size]),
                },
            },
            group: ['sizes'],
        })) as unknown as SizesCount[];

        const categoriesCount = getProductCategoriesCount(categoryGroupCount);
        const sizesCount = getProductSizesCount(sizesGroupCount);

        res.render('shop', {
            products,
            totalNoOfPages,
            currentPage,
            isLatestProducts: Boolean(parseInt(latest as string)),
            searchCategory: category,
            sortBy,
            orderBy,
            priceMin,
            priceMax,
            productSizes,
            categoriesCount,
            sizesCount,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
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

        if (error.message !== undefined) {
            next(error);
        } else if (error?.error !== undefined) {
            // timeoout error object is returned inside an object
            next(error.error);
        }
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
            // timeoout error object is returned inside an object
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
