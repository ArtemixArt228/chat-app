import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import responseHandlers from "../handlers/response";

import { messageService, s3Service } from "../services";

class MessageController {
    async createMessage(req: Request, res: Response) {
        try {
            const { sender, content, groupId, isVoiceMessage: isVoiceMessageStr } = req.body;

            // Convert string to boolean
            const isVoiceMessage = isVoiceMessageStr === 'true' || isVoiceMessageStr === '1';

            if (req.file) {
                const fileName = `${uuidv4()}-${Date.now()}`;

                await s3Service.uploadFile(req.file.buffer, fileName, req.file.mimetype)

                const newMessage = await messageService.createMessage(sender, content, groupId, isVoiceMessage, fileName);

                responseHandlers.created(res, newMessage);
            }

            const newMessage = await messageService.createMessage(sender, content, groupId, isVoiceMessage, null);

            responseHandlers.created(res, newMessage);
        } catch (error: any) {
            responseHandlers.badRequest(res, error.message);
        }
    }

    async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const { groupId } = req.params;

            const messages = await messageService.getMessages(groupId);

            for (let message of messages) {
                if (message.fileName) message.fileUrl = await s3Service.getObjectSignedUrl(message.fileName)
            }

            responseHandlers.ok(res, messages);
        } catch (error) {
            responseHandlers.error(res);
        }
    }
}

export const messageController = new MessageController();
