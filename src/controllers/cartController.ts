import type { NextFunction, Response } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import db from '../database';
import { CART_STATES, PRODUCT_SIZES } from '../constants';
import { setFlashMessage } from '../utilities';

const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const YOUR_DOMAIN = 'http://localhost:3000';

const Cart = db.carts;
const Product = db.products;
const CartItem = db.cartItems;
const Coupon = db.coupons;

export async function getCart(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const [userActiveCart] = await Cart.findOrCreate({
            where: {
                state: CART_STATES.PENDING,
                userId: req.user.id,
            },
            include: CartItem,
        });

        const cartItems = await userActiveCart.getCartItems({
            include: Product,
            order: [['createdAt', 'ASC']],
        });

        const cartCoupon = await userActiveCart.getCoupon();

        res.render('cart/cart', {
            cartItems,
            PRODUCT_SIZES,
            cartTotal: userActiveCart.cartTotal,
            cartCoupon,
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

export async function addProductToCart(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const productId = parseInt(req.params.productId);
        const { size, quantity } = req.body;

        const [userActiveCart] = await Cart.findOrCreate({
            where: {
                state: CART_STATES.PENDING,
                userId: req.user.id,
            },
            include: CartItem,
        });

        const product = await Product.findByPk(productId);
        if (product === null) {
            setFlashMessage(req, {
                message: 'Product no longer exists!',
                type: 'danger',
            });
            return;
        }

        const productIsInCart = userActiveCart.CartItems?.some(
            (cartItem) => cartItem.productId === product.id
        );
        if (productIsInCart) {
            setFlashMessage(req, {
                message: 'Product is already in cart. Go to Cart to modify it.',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        const cartItemTotal = quantity * product.price;
        await userActiveCart.createCartItem({
            size,
            quantity,
            productId: product.id,
            totalPrice: cartItemTotal,
        });
        await userActiveCart.update({
            cartTotal: userActiveCart.cartTotal + cartItemTotal,
        });

        setFlashMessage(req, {
            message: `Item has been added to your cart successfully!`,
            type: 'success',
        });
        res.redirect('back');
    } catch (error) {
        console.log(error.message, error);
        next(error);
    }
}

export async function removeProductFromCart(req, res, next): Promise<void> {
    try {
        const { cartItemId }: { cartItemId: number } = req.params;
        const userActiveCart = await Cart.findOne({
            where: {
                userId: req.user.id,
                state: CART_STATES.PENDING,
            },
        });
        if (userActiveCart === null) {
            setFlashMessage(req, {
                message: 'Your cart does not exist again. Add a new product',
                type: 'warning',
            });
            res.redirect('back');
            return;
        }

        const cartItem = await CartItem.findOne({
            where: {
                id: cartItemId,
                cartId: userActiveCart.id,
            },
        });

        if (cartItem === null) {
            res.redirect('back');
            return;
        }

        await CartItem.destroy({
            where: {
                id: cartItemId,
                cartId: userActiveCart.id,
            },
        });
        await userActiveCart.update({
            cartTotal: userActiveCart.cartTotal - cartItem?.totalPrice,
        });

        setFlashMessage(req, {
            message: 'Item removed from your cart successfully!',
            type: 'success',
        });
        res.redirect('back');
    } catch (error) {
        console.log(error.message, error);
        next(error);
    }
}

export async function updateCart(req, res: Response, next): Promise<void> {
    try {
        const { body: cartItemsUpdate } = req;
        const userActiveCart = await Cart.findOne({
            where: {
                userId: req.user.id,
                state: CART_STATES.PENDING,
            },
        });
        if (userActiveCart === null) {
            res.redirect('back');
            return;
        }

        for (const cartItemId of Object.keys(cartItemsUpdate)) {
            await CartItem.update(
                { ...cartItemsUpdate[cartItemId] },
                {
                    where: { cartId: userActiveCart.id, id: cartItemId },
                    individualHooks: true,
                }
            );
        }

        const cartTotal = (await userActiveCart.getCartItems()).reduce(
            (acc, cartItem) => acc + cartItem.totalPrice,
            0
        );
        await userActiveCart.update({ cartTotal });
        setFlashMessage(req, {
            message: 'Cart updated successfully!',
            type: 'success',
        });
        res.redirect('back');
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

export async function addCouponToCart(req, res, next): Promise<void> {
    try {
        const { couponCode } = req.body;

        const coupon = await Coupon.findOne({ where: { code: couponCode } });
        if (coupon === null) {
            setFlashMessage(req, {
                message: 'Coupon code is invalid',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        const userActiveCart = await Cart.findOne({
            where: {
                userId: req.user.id,
                state: CART_STATES.PENDING,
            },
        });

        if (userActiveCart === null) {
            setFlashMessage(req, {
                message: 'Something strange happended. Try again!',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        if (userActiveCart.couponId === coupon.id) {
            setFlashMessage(req, {
                message: 'Coupon has been added for this cart already!',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        if (coupon.usage >= coupon.maxUsuage) {
            setFlashMessage(req, {
                message: 'Coupon has reached its max limit',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        await userActiveCart.setCoupon(coupon.id);
        await coupon.update({ usage: coupon.usage + 1 });

        setFlashMessage(req, {
            message: 'Coupon added succesfully!',
            type: 'success',
        });
        res.redirect('back');
    } catch (error) {
        console.log(error);

        console.log(error.message);
        next(error);
    }
}

export async function getCheckout(req, res, next): Promise<void> {
    try {
        res.render('cart/checkout');
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function postCheckout(req, res, next): Promise<void> {
   try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price_data: {
                        unit_amount: 2000,
                        product_data: {
                            name: 'T-shirt',
                        },
                        currency: 'usd',
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/cart/checkout/success`,
            cancel_url: `${YOUR_DOMAIN}/cart/checkout/cancel`,
        });

        res.redirect(303, session.url);
   } catch (err) {
        console.log(err);
        next(err);
   } 
}

export async function getCheckoutSuccess(req, res, next): Promise<void> {
    try {
        res.render('cart/success');
    } catch (err) {
        console.log(err);
        next(err);
    }
}


export async function getCheckoutCancel(req, res, next): Promise<void> {
    try {
        res.render('cart/cancel');
    } catch (err) {
        console.log(err);
        next(err);
    }
}

