import sessionModel from "../models/session.model";

import { ISessionRepository } from "../interfaces/session.interfaces";

class SessionRepository implements ISessionRepository {
    public async createChatSession(userId: string, sessionID: string, expiresAt: Date) {
        return sessionModel.create({
            userId,
            sessionID,
            expiresAt,
        });
    }

    public async findChatSession(query: any) {
        return sessionModel.findOne(query).exec();
    }

    public async deleteChatSession(sessionID: string) {
        return sessionModel.deleteOne({ sessionID })
    }
}

export const sessionRepository = new SessionRepository();
