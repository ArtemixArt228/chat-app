import logModel from "../models/log.model";

import {ILogRepository} from "../interfaces/log.interfaces";

class LogRepository implements ILogRepository {
    async createLog(action: string, description: string, user: string) {
        await logModel.create({
            action,
            description,
            user,
        });
    }

    async getAllLogs() {
        return logModel.find()
            .populate('user', 'username')
            .sort({createdAt: -1});
    }
}

export const logRepository = new LogRepository();
