import {logRepository} from "../repository";

import {ILogRepository} from "../interfaces/log.interfaces";

class LogService {
    constructor(private logRepository: ILogRepository) {}

    async getLogs() {
        return await this.logRepository.getAllLogs();
    }
}

export const logService = new LogService(logRepository);
