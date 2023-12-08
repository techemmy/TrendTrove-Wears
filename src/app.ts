import type { Application } from 'express';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { appConfig, sessionConfig } from './config';
import authRouter from './routes/authRoute';
import userRouter from './routes/userRoute';
import bodyParser from 'body-parser';
import type { IRequestWithFlashMessages } from './types/requestTypes';
import appErrorHandlerMiddleware from './middlewares/appErrorHandlerMiddleware';
import productRouter from './routes/productRoute';
import adminRouter from './routes/adminRoute';
import {
    ensureAdminUserMiddleware,
    ensureLoggedInMiddleware,
} from './middlewares/authenticationMiddlewares';
import cartRouter from './routes/cartRoute';

const app: Application = express();

app.set('view engine', 'ejs');

if (appConfig.ENV === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use((req: IRequestWithFlashMessages, res, next) => {
    // middleware to enable usage of req object in ejs conditional tag
    // for checking authenticated with the req.isAuthenticated() method
    res.locals.req = req;

    // handle flash messages
    res.locals.flashMessages = req.session.flashMessages;
    delete req.session.flashMessages;
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/auth', authRouter);
app.use('/user', ensureLoggedInMiddleware, userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use(
    '/admin',
    ensureLoggedInMiddleware,
    ensureAdminUserMiddleware,
    adminRouter
);

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/cart', ensureLoggedInMiddleware, (req, res) => {
    res.render('cart');
});

app.get('/checkout', (req, res) => {
    res.render('checkout');
});

app.get('/thankyou', (req, res) => {
    res.render('thankyou');
});

app.use((req, res) => {
    res.status(404).render('error', {
        error: {
            title: 'Page not found.',
            message: 'Click the link below :)',
        },
    });
});

app.use(appErrorHandlerMiddleware);

export default app;
