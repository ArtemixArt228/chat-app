import {IMessageRepository} from "../interfaces/message.interfaces";
import {ILogRepository} from "../interfaces/log.interfaces";

import {logRepository, messageRepository} from "../repository";


class MessageService {
    constructor(
        private messageRepository: IMessageRepository,
        private logRepository: ILogRepository
    ) {}

    async createMessage(sender: string, content: string | null, groupId: string, isVoiceMessage: boolean, fileName: string | null) {
        // Business validation for message creation
        if (isVoiceMessage && !fileName) {
            throw new Error("The voice message must contain a file.");
        }
        if (!isVoiceMessage && !content) {
            throw new Error("A text message must contain content.");
        }

        const newMessage = await this.messageRepository.createMessage({
            sender,
            content: isVoiceMessage ? null : content,
            groupId,
            isVoiceMessage,
            fileName: isVoiceMessage ? fileName : null,
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
