export interface IMessageRepository {
    createMessage(data: {
        sender: string;
        content: string | null;
        groupId: string;
        isVoiceMessage: boolean;
        isImage: boolean;
        fileName: string | null;
    }): Promise<any>;
    getMessagesByGroupId(groupId: string): Promise<any>;
}
