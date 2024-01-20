import 'dotenv/config';
import type { NextFunction, Response } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import db from '../database';
import { CART_STATES, PRODUCT_SIZES } from '../constants';
import { setFlashMessage } from '../utilities';
import { appConfig } from '../config';
import type { CouponAttributes } from '../types/models/couponTypes';

const stripe = require('stripe')(appConfig.STRIPE_API_KEY);

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

export async function updateCartState(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { cartId } = req.params;
        await Cart.update(
            { state: CART_STATES.DELIVERED },
            {
                where: {
                    id: cartId,
                },
            },
        );

        setFlashMessage(req, {
            message: 'Order state updated succesfully!',
            type: 'success',
        });
        res.redirect('back');
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function removeProductFromCart(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const cartItemId: string = req.params.cartItemId;
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

export async function updateCart(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
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

export async function getClearCart(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { cartId } = req.params;
        const userActiveCart = await Cart.findOne({
            where: {
                id: cartId,
                userId: req.user.id,
            },
            include: CartItem,
        });

        if (
            userActiveCart === null ||
            userActiveCart.state !== CART_STATES.PENDING
        ) {
            setFlashMessage(req, {
                message: 'You can only clear your current/pending carts',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        const cartItemsIds = userActiveCart.CartItems.map(
            (cartItem) => cartItem.id
        ) as number[];
        await userActiveCart.removeCartItems(cartItemsIds);
        await userActiveCart.update({ cartTotal: 0 });

        setFlashMessage(req, {
            message: 'Cart cleared successfully!',
            type: 'success',
        });
        res.redirect('back');
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function addCouponToCart(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { couponCode } = req.body;

        const coupon = await Coupon.findOne({ where: { code: couponCode } });
        if (coupon === null) {
            setFlashMessage(req, {
                message: 'Coupon code is invalid',
                type: 'warning',
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
                type: 'warning',
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

        if (coupon.usage >= coupon.maxUsage) {
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

export async function getCheckout(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userActiveCart = await Cart.findOne({
            where: {
                state: CART_STATES.PENDING,
                userId: req.user.id,
            },
            include: [Coupon],
        });

        if (userActiveCart === null) {
            setFlashMessage(req, {
                message:
                    'You do not have an active cart. Go and add some items to cart.',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        const cartItems = await userActiveCart.getCartItems({
            include: Product,
            order: [['createdAt', 'ASC']],
        });

        res.render('cart/checkout', {
            cartItems,
            coupon: userActiveCart.Coupon,
            cartTotal: userActiveCart.cartTotal,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function postCheckout(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userActiveCart = await Cart.findOne({
            where: {
                state: CART_STATES.PENDING,
                userId: req.user.id,
            },
            include: Coupon,
        });

        if (userActiveCart === null) {
            setFlashMessage(req, {
                message:
                    'You do not have an active cart. Go and add some items to cart.',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        const cartItems = await userActiveCart.getCartItems({
            include: Product,
            order: [['createdAt', 'ASC']],
        });

        if (cartItems.length <= 0) {
            setFlashMessage(req, {
                message: 'Your cart is empty. Go shopping :)',
                type: 'warning',
            });
            res.redirect('back');
            return;
        }

        const checkoutItems = cartItems.map((cartItem) => {
            const amount = cartItem.Product.price as number;
            return {
                price_data: {
                    unit_amount: parseFloat((amount * 100).toFixed(2)), // unit amount takes in amount in cent by default, hence, multiplying by 100
                    product_data: {
                        name: cartItem.Product.name,
                        description: cartItem.Product.shortDescription,
                        images: [cartItem.Product.imageURL],
                    },
                    currency: 'usd',
                },
                quantity: cartItem.quantity,
            };
        });
        console.log(
            parseFloat((cartItems[0].Product.price as number).toFixed(2)),
            parseFloat((cartItems[0].Product.price as number).toFixed(2)) * 100
        );
        console.log(checkoutItems);

        const userCoupon = userActiveCart.Coupon as CouponAttributes | null;
        let coupon;

        if (userCoupon !== null) {
            coupon = await stripe.coupons.create({
                amount_off: userCoupon.amount * 100,
                currency: 'usd',
                duration: 'once',
            });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: checkoutItems,
            discounts: [{ coupon: coupon?.id }],
            mode: 'payment',
            success_url: `${appConfig.APP_DOMAIN}/cart/checkout/success`,
            cancel_url: `${appConfig.APP_DOMAIN}/cart/checkout/cancel`,
        });
        res.redirect(303, checkoutSession.url);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function getCheckoutSuccess(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userActiveCart = await Cart.findOne({
            where: {
                state: CART_STATES.PENDING,
                userId: req.user.id,
            },
        });

        if (userActiveCart === null) {
            setFlashMessage(req, {
                message:
                    'You do not have an active cart. Go and add some items to cart.',
                type: 'info',
            });
            res.redirect('back');
            return;
        }

        await userActiveCart.update({
            state: CART_STATES.PROCESSING,
            address: `${req.user.Address?.street ?? ''} - ${
                req.user.Address?.state ?? ''
            } - ${req.user.Address?.country ?? ''}`,
        });

        res.render('cart/success');
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function getCheckoutCancel(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        res.render('cart/cancel');
    } catch (err) {
        console.log(err);
        next(err);
    }
}
