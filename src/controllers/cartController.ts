import type { NextFunction, Response } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import db from '../database';
import { CART_STATES, PRODUCT_SIZES } from '../constants';
import { setFlashMessage } from '../utilities';

const Cart = db.carts;
const Product = db.products;
const CartItem = db.cartItems;

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

        res.render('cart', { cartItems, PRODUCT_SIZES });
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

        const productIsInCart = userActiveCart.CartItems.some(
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
            cartTotal: userActiveCart.cartTotal + quantity * product.price,
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
        const { cartItemId } = req.params;
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
        await CartItem.destroy({
            where: {
                id: cartItemId,
                cartId: userActiveCart.id,
            },
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
                { where: { cartId: userActiveCart.id, id: cartItemId } }
            );
        }
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
