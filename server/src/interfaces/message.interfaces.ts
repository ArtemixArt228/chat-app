export interface IMessageRepository {
    createMessage(data: {
        sender: string;
        content: string | null;
        groupId: string;
        isVoiceMessage: boolean;
        fileURL: string | null;
    }): Promise<any>;
    getMessagesByGroupId(groupId: string): Promise<any>;
}
