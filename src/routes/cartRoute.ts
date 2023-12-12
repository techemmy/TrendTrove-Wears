import router from 'express';
import type { Router } from 'express';
import * as cartController from '../controllers/cartController';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import { addProductToCartValidator } from '../validators';

const cartRouter: Router = router();

cartRouter.get('/', cartController.getCart);

cartRouter.post(
    '/product/:productId',
    addProductToCartValidator,
    validationErrorHandlerMiddleware,
    cartController.addProductToCart
);

export default cartRouter;
