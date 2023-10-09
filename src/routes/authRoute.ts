import router, { type Router } from 'express';
import passport from 'passport';
import googleAuthStrategyMiddleware from '../middlewares/googleAuthStrategyMiddleware';

const authRouter: Router = router();

googleAuthStrategyMiddleware();

authRouter.get('/signup', (req, res) => {
    res.render('auth/signup');
});

authRouter.get('/login', (req, res) => {
    res.render('auth/login');
});

authRouter.get('/logout', (req: any, res) => {
    console.log(req.session.destroy());
    res.redirect('/');
});

authRouter.get(
    '/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

authRouter.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/shop',
        failureRedirect: '/auth/signup',
    })
);

export default authRouter;
