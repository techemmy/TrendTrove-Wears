import type { flashMessage } from './types/flashMessageType';
import type { IRequestWithFlashMessages } from './types/requestTypes';

export function setFlashMessages(
    req: IRequestWithFlashMessages,
    messages: flashMessage[]
): void {
    req.session.flashMessages = messages;
}
