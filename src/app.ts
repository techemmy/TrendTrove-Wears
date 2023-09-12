import type { Application } from 'express';
import express from 'express';

const app: Application = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

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
