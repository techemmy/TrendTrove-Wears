import router from 'express';
import type { Router } from 'express';

const cartRouter: Router = router();

cartRouter.post('/product/:productId', async (req, res) => {
    console.log(req.body, req.params.productId);
    res.redirect('back');
});

export default cartRouter;
