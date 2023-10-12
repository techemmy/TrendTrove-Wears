import type { IRequestWithFlashMessages } from './types/requestTypes';

export function setFlashMessages(messages, req: IRequestWithFlashMessages): void {
    req.session.flashMessages = messages;
}
