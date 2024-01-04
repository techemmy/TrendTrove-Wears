import router from 'express';
import type { Router } from 'express';
import * as cartController from '../controllers/cartController';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import { addProductToCartValidator } from '../validators';

const cartRouter: Router = router();

cartRouter.get('/', cartController.getCart);

cartRouter.post(
    '/create/product/:productId',
    addProductToCartValidator,
    validationErrorHandlerMiddleware,
    cartController.addProductToCart
);

cartRouter.get(
    '/delete/product/:cartItemId',
    cartController.removeProductFromCart
);

cartRouter.post('/update', cartController.updateCart);

// add validator to route
cartRouter.post('/coupon/add', cartController.addCouponToCart);

cartRouter.get('/checkout', cartController.getCheckout);

cartRouter.post('/checkout', cartController.postCheckout);

cartRouter.get('/checkout/success', cartController.getCheckoutSuccess);

cartRouter.get('/checkout/cancel', cartController.getCheckoutCancel);

export default cartRouter;
