export interface ISessionRepository {
    createChatSession(userId: string, sessionID: string, expiresAt: Date): Promise<any>;
    findChatSession(query: any): Promise<any>;
    deleteChatSession(sessionID: string): Promise<any>;
}
