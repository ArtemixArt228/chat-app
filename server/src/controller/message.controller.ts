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

            let fileName = null;

            // If there is a file, upload it and set the fileName
            if (req.file) {
                fileName = `${uuidv4()}-${Date.now()}`;
                await s3Service.uploadFile(req.file.buffer, fileName, req.file.mimetype);
            }

            // Create message, passing null as the fileName if there is no file
            const newMessage = await messageService.createMessage(sender, content, groupId, isVoiceMessage, fileName);

            // Send response only once
            responseHandlers.created(res, newMessage);
        } catch (error: any) {
            responseHandlers.badRequest(res, error.message);
        }
    }

    async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const { groupId } = req.params;

            const messages = await messageService.getMessages(groupId);

            // Use Promise.all to wait for all the async operations to complete
            await Promise.all(messages.map(async (message: any) => {
                if (message.fileName) {
                    message.fileUrl = await s3Service.getObjectSignedUrl(message.fileName);
                }
            }));

            responseHandlers.ok(res, messages); // Send response after all async calls complete
        } catch (error) {
            responseHandlers.error(res); // Ensure only one response is sent
        }
    }
}

export const messageController = new MessageController();
