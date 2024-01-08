import router, { type Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';

const wishlistRouter: Router = router();

wishlistRouter.get('/', wishlistController.getWishlist);

export default wishlistRouter;

