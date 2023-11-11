import router, { type Router } from 'express';
import * as productController from '../controllers/productController';
import multer, { MulterError } from 'multer';
import { ONE_MB_IN_BYTES, fileUploadLimit } from '../constants';
import { setFlashMessage } from '../utilities';
import { ensureAdminUserMiddleware } from '../middlewares/authenticationMiddlewares';

const productRouter: Router = router();
const getProductImage = multer({
    limits: { fileSize: fileUploadLimit * ONE_MB_IN_BYTES },
}).single('image');

productRouter.get('/', productController.getAllProduct);

productRouter.post(
    '/',
    // TODO: add field validation
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
    productController.postCreateProduct
);

productRouter.get('/:productId', productController.getProductById);

productRouter.get(
    '/:productId/delete',
    ensureAdminUserMiddleware,
    productController.getDeleteProductById
);

export default productRouter;
