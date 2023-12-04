import DataURIParser from 'datauri/parser';
import { cloudinaryConfig } from './config';
import type { flashMessage } from './types/flashMessageType';
import type { IRequestWithFlashMessages } from './types/requestTypes';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import type { CategoryCount, SizesCount } from './types/models/productTypes';

export function setFlashMessage(
    req: IRequestWithFlashMessages,
    message: flashMessage | flashMessage[]
): void {
    if (Array.isArray(message)) {
        req.session.flashMessages = message;
    } else {
        req.session.flashMessages = [message];
    }
}

export function cloudinaryAPI(): typeof cloudinary {
    cloudinary.config({
        cloud_name: cloudinaryConfig.CLOUD_NAME,
        api_key: cloudinaryConfig.API_KEY,
        api_secret: cloudinaryConfig.API_SECRET,
    });

    return cloudinary;
}

export function convertBufferToImageURI(filename, buffer): string | undefined {
    const dUri = new DataURIParser();
    const image = dUri.format(path.extname(filename).toString(), buffer);
    return image.content;
}

export function getPagination(
    page: number,
    size: number
): { limit: number; offset: number; currentPage: number } {
    const limit = isNaN(size) ? 6 : +size;
    const offset = isNaN(page) ? 0 : (+page - 1) * limit;
    const currentPage = isNaN(page) ? 1 : page;
    return { limit, offset, currentPage };
}

export function getProductCategoriesCount(
    categoryCount: CategoryCount[]
): Record<string, number> {
    const counts: Record<string, number> = categoryCount.reduce(
        (acc, { category, count }: CategoryCount) => {
            acc[category] = count;
            return acc;
        },
        {}
    );

    const MEN = counts.MEN ?? 0;
    const WOMEN = counts.WOMEN ?? 0;
    const CHILDREN = counts.CHILDREN ?? 0;
    return { MEN, WOMEN, CHILDREN };
}

export function getProductSizesCount(
    sizesCount: SizesCount[]
): Record<string, number> {
    const sizeCount: Record<string, number> = sizesCount.reduce(
        (acc, { sizes, count }: SizesCount) => {
            acc[sizes[0]] = count;
            return acc;
        },
        {}
    );

    const SMALL = sizeCount.S ?? 0;
    const MEDIUM = sizeCount.M ?? 0;
    const LARGE = sizeCount.L ?? 0;
    return { SMALL, MEDIUM, LARGE };
}
