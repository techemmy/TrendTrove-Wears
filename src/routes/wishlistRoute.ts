import router, { type Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';

const wishlistRouter: Router = router();

wishlistRouter.get('/', wishlistController.getWishlist);

wishlistRouter.get(
    '/add/:productId',
    wishlistController.getAddProductToWishlist
);

wishlistRouter.get(
    '/remove/:productId',
    wishlistController.getRemoveProductFromWishlist
);

export default wishlistRouter;
