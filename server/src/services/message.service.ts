import {IMessageRepository} from "../interfaces/message.interfaces";
import {ILogRepository} from "../interfaces/log.interfaces";

import {logRepository, messageRepository} from "../repository";


class MessageService {
    constructor(
        private messageRepository: IMessageRepository,
        private logRepository: ILogRepository
    ) {}

    async createMessage(sender: string, content: string | null, groupId: string, isVoiceMessage: boolean, fileURL: string | null) {
        // Business validation for message creation
        if (isVoiceMessage && !fileURL) {
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
            fileURL: isVoiceMessage ? fileURL : null,
        });

        // Log the message creation
        const description = isVoiceMessage
            ? `User ${sender} sent a voice message: ${fileURL}`
            : `User ${sender} sent the text message: ${content}`;

        await this.logRepository.createLog("send_message", description, sender);

        return newMessage;
    }

    async getMessages(groupId: string) {
        return await this.messageRepository.getMessagesByGroupId(groupId);
    }
}

export const messageService = new MessageService(messageRepository, logRepository);
