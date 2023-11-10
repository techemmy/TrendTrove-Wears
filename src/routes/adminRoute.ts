import router, { type Router } from 'express';
import * as adminController from '../controllers/adminController';

const adminRouter: Router = router();

adminRouter.get('/', (req, res) => {
    res.redirect('/dashboard');
});

adminRouter.get('/dashboard', adminController.getDashboard);

export default adminRouter;
