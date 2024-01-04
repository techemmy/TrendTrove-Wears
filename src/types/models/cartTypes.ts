export interface CartItemAttributes {
    id?: number;
    size: string;
    quantity: number;
    totalPrice: number;
    productId?: number;
    cartId?: number;
}

export interface CartAttributes {
    id?: number;
    couponId?: number;
    cartTotal: number;
    userId?: number;
    state: string;
    Coupon?: string;
    createdAt?: Date;
    updatedAt?: Date;
    CartItems?: CartItemAttributes[];
}
