import type { Application } from 'express';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { appConfig } from './config';
import authRouter from './routes/authRoute';

const app: Application = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
    session({
        secret: appConfig.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);
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
