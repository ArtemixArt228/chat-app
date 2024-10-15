import { Request, Response } from 'express';

import responseHandlers from "../handlers/response";

import {messageService} from "../services/message.service";

class MessageController {
    async createMessage(req: Request, res: Response) {
        try {
            const { sender, content, groupId, isVoiceMessage: isVoiceMessageStr } = req.body;

            // Convert string to boolean
            const isVoiceMessage = isVoiceMessageStr === 'true' || isVoiceMessageStr === '1';

            const fileURL: string | null = req.file ? req.file.path : null;

            const newMessage = await messageService.createMessage(sender, content, groupId, isVoiceMessage, fileURL);

            responseHandlers.created(res, newMessage);
        } catch (error: any) {
            responseHandlers.badRequest(res, error.message);
        }
    }

    async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const { groupId } = req.params;

            const messages = await messageService.getMessages(groupId);

            responseHandlers.ok(res, messages);
        } catch (error) {
            responseHandlers.error(res);
        }
    }
}

export const messageController = new MessageController();
