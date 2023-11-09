import router, { type Router } from 'express';
import * as adminController from '../controllers/adminController';

const adminRouter: Router = router();

adminRouter.get('/', adminController.getDashboard);

export default adminRouter;
