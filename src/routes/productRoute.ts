import router, { type Router } from 'express';
import * as productController from '../controllers/productController';

const productRouter: Router = router();

productRouter.get('/', productController.getAllProduct);

productRouter.get('/:productId', productController.getProductById);

export default productRouter;
