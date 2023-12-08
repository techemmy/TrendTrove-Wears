import router from 'express';
import type { Router } from 'express';
import * as cartController from '../controllers/cartController';

const cartRouter: Router = router();

cartRouter.post('/product/:productId', cartController.addProductToCart);

export default cartRouter;
