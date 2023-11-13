import router, { type Router } from 'express';
import * as productController from '../controllers/productController';
import multer, { MulterError } from 'multer';
import { ONE_MB_IN_BYTES, fileUploadLimit } from '../constants';
import { setFlashMessage } from '../utilities';
import { ensureAdminUserMiddleware } from '../middlewares/authenticationMiddlewares';
import { body } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';

const productRouter: Router = router();
const getProductImage = multer({
    limits: { fileSize: fileUploadLimit * ONE_MB_IN_BYTES },
}).single('image');

productRouter.get('/', productController.getAllProduct);

productRouter.post(
    '/',
    (req, res, next) => {
        getProductImage(req, res, (err) => {
            if (err !== undefined && err?.code === 'LIMIT_FILE_SIZE') {
                setFlashMessage(req, {
                    type: 'warning',
                    message: `Upload failed because the size is greater than ${fileUploadLimit} MB. Try another file.`,
                });
                res.redirect('back');
                return;
            } else if (err instanceof MulterError) {
                setFlashMessage(req, {
                    type: 'warning',
                    message: err.message,
                });
                res.redirect('back');
                return;
            }
            next();
        });
    },
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
    '/:productId/delete',
    ensureAdminUserMiddleware,
    productController.getDeleteProductById
);

export default productRouter;
