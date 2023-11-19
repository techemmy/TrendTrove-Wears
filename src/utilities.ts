import DataURIParser from 'datauri/parser';
import { cloudinaryConfig } from './config';
import type { flashMessage } from './types/flashMessageType';
import type { IRequestWithFlashMessages } from './types/requestTypes';
import { v2 as cloudinary } from 'cloudinary';
import path from 'node:path';

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
    const limit = isNaN(size) ? 9 : +size;
    const offset = isNaN(page) ? 0 : (+page - 1) * limit;
    const currentPage = isNaN(page) ? 1 : page;
    return { limit, offset, currentPage };
}
