import type { flashMessage } from './types/flashMessageType';
import type { IRequestWithFlashMessages } from './types/requestTypes';

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
