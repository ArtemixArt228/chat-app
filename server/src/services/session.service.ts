import {sessionRepository} from "../repository";

import {ISessionRepository} from "../interfaces/session.interfaces";

class SessionService {
    constructor(private sessionRepository: ISessionRepository) {}

    async deleteSession(sessionID: string) {
        return await this.sessionRepository.deleteChatSession(sessionID);
    }

    async createOrUpdateSession(userId: string) {
        const existingSession = await this.sessionRepository.findChatSession({ user: userId });

        if (existingSession) {
            existingSession.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
            await existingSession.save();
            return existingSession;
        }

        const sessionID = `${userId}-${Date.now()}`;

        return await this.sessionRepository.createChatSession(
            userId,
            sessionID,
            new Date(Date.now() + 60 * 60 * 1000),
        );
    }

    async validateSession(sessionID: string) {
        const session = await this.sessionRepository.findChatSession({ sessionID });

        if (!session || session.expiresAt < Date.now()) {
            return null;
        }
        return session;
    }
}

export const sessionService = new SessionService(sessionRepository);

