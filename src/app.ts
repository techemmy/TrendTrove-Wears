import type { Application } from 'express';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { appConfig, sessionConfig } from './config';
import authRouter from './routes/authRoute';
import bodyParser from 'body-parser';
import { IRequestWithFlashMessages } from './types/requestTypes';

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

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, user);
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// middleware to enable usage of req object in ejs conditional tag
// to prevent passing the req object to multiple route responses
app.use((req: IRequestWithFlashMessages, res, next) => {
    res.locals.req = req;

    // handle flash messages
    res.locals.flashMessages = req.session.flashMessages;
    delete req.session.flashMessages;
    next();
});

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/shop', (req, res) => {
    res.render('shop');
});

app.get('/single-product', (req, res) => {
    res.render('single-product');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/checkout', (req, res) => {
    res.render('checkout');
});

app.get('/thankyou', (req, res) => {
    res.render('thankyou');
});

export default app;
