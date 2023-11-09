import { UserRoleEnum } from './types/models/userTypes';

export const USER_ROLES = Object.values(UserRoleEnum) as UserRoleEnum[];

export const PRODUCT_SIZES = {
    S: 'SMALL',
    M: 'MEDIUM',
    L: 'LARGE',
};

export const PRODUCT_CATEGORIES = ['MEN', 'WOMEN', 'CHILDREN'];

export const CART_STATES = {
    PENDING: 'PENDING',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
};

export const ONE_MB_IN_BYTES: number = 1000000;
export const profileImageUploadLimitInMb: number = 5;
export const ALLOWED_IMAGE_TYPES: string[] = ['jpg', 'jpeg', 'png', 'gif'];
