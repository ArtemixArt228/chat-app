import { IMessageRepository } from "../interfaces/message.interfaces";
import { ILogRepository } from "../interfaces/log.interfaces";

import { logRepository, messageRepository } from "../repository";


class MessageService {
    constructor(
        private messageRepository: IMessageRepository,
        private logRepository: ILogRepository
    ) { }

    async createMessage(sender: string, content: string | null, groupId: string, isVoiceMessage: boolean, isImage: boolean, fileName: string | null) {


        const newMessage = await this.messageRepository.createMessage({
            sender,
            content: isVoiceMessage ? null : content,
            groupId,
            isVoiceMessage,
            isImage,
            fileName: isVoiceMessage || isImage ? fileName : null,
        });

        // Log the message creation
        const description = isVoiceMessage
            ? `User ${sender} sent a voice message: ${fileName}`
            : `User ${sender} sent the text message: ${content}`;

        await this.logRepository.createLog("send_message", description, sender);

        return newMessage;
    }

    async getMessages(groupId: string) {
        return await this.messageRepository.getMessagesByGroupId(groupId);
    }
}

export const messageService = new MessageService(messageRepository, logRepository);
