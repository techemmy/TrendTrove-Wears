import { cloudinaryConfig } from './config';
import type { flashMessage } from './types/flashMessageType';
import type { IRequestWithFlashMessages } from './types/requestTypes';
import { v2 as cloudinary } from 'cloudinary';

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
