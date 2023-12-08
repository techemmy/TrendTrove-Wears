import type { NextFunction, Request, Response } from 'express';

export async function addProductToCart(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    console.log(req.body, req.params.productId);
    res.redirect('back');
}
