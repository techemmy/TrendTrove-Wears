export interface CartItemAttributes {
    id?: number;
    size: string;
    quantity: string;
    color: string;
    totalPrice: number;
    productId: number;
    cartId: number;
}

export interface CartAttributes {
    id?: number;
    couponId: number;
    cartTotal: number;
    userId: number;
}
