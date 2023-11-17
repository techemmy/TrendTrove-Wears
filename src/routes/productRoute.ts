import router, { type Router } from 'express';
import * as productController from '../controllers/productController';
import multer, { MulterError } from 'multer';
import { ONE_MB_IN_BYTES, fileUploadLimit } from '../constants';
import { setFlashMessage } from '../utilities';
import { ensureAdminUserMiddleware } from '../middlewares/authenticationMiddlewares';
import { body } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import getValidFormImage from '../middlewares/getValidFormImageMiddleware';

const productRouter: Router = router();

productRouter.get('/', productController.getAllProduct);

productRouter.post(
    '/',
    getValidFormImage,
    [
        body('name')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Product name is required'),
        body('price')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Product price is required')
            .toFloat()
            .isFloat({ min: 0 })
            .withMessage('Product price cannot be less than zero'),
        body('category')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Product category is required'),
        body('sizes')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Choose at least one size'),
        body('shortDescription')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('A short description of the product is required'),
    ],
    validationErrorHandlerMiddleware,
    productController.postCreateProduct
);

productRouter.get('/:productId', productController.getProductById);

productRouter.get(
    '/:productId/update',
    ensureAdminUserMiddleware,
    productController.getUpdateProductById
);

productRouter.post(
    '/:productId/update',
    ensureAdminUserMiddleware,
    getValidFormImage,
    [
        body('name')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Product name is required'),
        body('price')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Product price is required')
            .toFloat()
            .isFloat({ min: 0 })
            .withMessage('Product price cannot be less than zero'),
        body('category')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Product category is required'),
        body('sizes')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Choose at least one size'),
        body('shortDescription')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('A short description of the product is required'),
    ],
    validationErrorHandlerMiddleware,
    productController.postUpdateProductById
);

productRouter.get(
    '/:productId/delete',
    ensureAdminUserMiddleware,
    productController.getDeleteProductById
);

export default productRouter;
