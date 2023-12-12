import type { NextFunction, Request, Response } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import db from '../database';
import { CART_STATES } from '../constants';
import { setFlashMessage } from '../utilities';

const Cart = db.carts;
const Product = db.products;
const CartItem = db.cartItems;

export async function getCart(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    res.render('cart');
}

export async function addProductToCart(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    const productId = parseInt(req.params.productId);
    const { size, quantity } = req.body;

    const [activeCart] = await Cart.findOrCreate({
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

    const productIsInCart = activeCart.CartItems.some(
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

    await activeCart.createCartItem({
        size,
        quantity,
        productId: product.id,
        totalPrice: quantity * product.price,
    });
    setFlashMessage(req, {
        message: `Item has been added to your cart successfully!`,
        type: 'success',
    });
    res.redirect('back');
}
