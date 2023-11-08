import router, { type Router } from 'express';

const adminRouter: Router = router();

adminRouter.get('/', (req, res) => {
    res.render('admin/dashboard');
});

export default adminRouter;
