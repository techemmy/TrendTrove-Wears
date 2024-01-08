import type { Request, Response, NextFunction } from 'express';
import { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import db from '../database';
import { ProductAttributes } from '../types/models/productTypes';

const User = db.users;
const Product = db.products;

export async function getWishlist(req: IRequestWithAuthenticatedUser, res: Response, next: NextFunction) {
    try {
        const user = await User.findByPk(req.user.id);
        const productsIds = user?.wishlist ?? [];
        const productsIdsLength = productsIds.length;

        const wishlistPromises: Array<[number, Promise<ProductAttributes | null>]> = productsIds.map(productId => [productId, Product.findByPk(productId)]);
        const wishlist: any = [];

        for (const promise of wishlistPromises) {
            const product = await promise[1];
            wishlist.push(product);
            
            if (product === null) {
                 productsIds.splice(productsIds.indexOf(promise[0]), 1); 
            };
        }

        if (productsIdsLength !== productsIds.length) {
            await user?.update({ wishlist: productsIds }); 
        };
        
        res.render('wishlist', { wishlist }); 
    } catch (err) {
       console.log(err);
       next(err);
    }
}

