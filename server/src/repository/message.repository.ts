import messageModel from "../models/message.model";

import {IMessageRepository} from "../interfaces/message.interfaces";

class MessageRepository implements IMessageRepository {
    async createMessage(data: {
        sender: string;
        content: string | null;
        groupId: string;
        isVoiceMessage: boolean;
        isImage: boolean;
        fileName: string | null;
    }) {
        const newMessage = await messageModel.create(data);
        await newMessage.save();
        return newMessage;
    }

    async getMessagesByGroupId(groupId: string) {
        return messageModel.find({groupId})
            .populate('sender', 'username')
            .sort({createdAt: 1});
    }
}

export const messageRepository = new MessageRepository();
