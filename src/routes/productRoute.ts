import router, { type Router } from 'express';
import * as productController from '../controllers/productController';
import multer, { MulterError } from 'multer';
import { ONE_MB_IN_BYTES, fileUploadLimit } from '../constants';
import { setFlashMessage } from '../utilities';
import { ensureAdminUserMiddleware } from '../middlewares/authenticationMiddlewares';
import { body } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import getValidFormImage from '../middlewares/getValidFormImageMiddleware';
import { newProductFormValidators } from '../validators';

const productRouter: Router = router();

productRouter.get('/', productController.getAllProduct);

productRouter.post(
    '/',
    getValidFormImage,
    newProductFormValidators,
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
    newProductFormValidators,
    validationErrorHandlerMiddleware,
    productController.postUpdateProductById
);

productRouter.get(
    '/:productId/delete',
    ensureAdminUserMiddleware,
    productController.getDeleteProductById
);

export default productRouter;
