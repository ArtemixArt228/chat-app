import { Request, Response } from 'express';

import responseHandlers from "../handlers/response";

import {logService} from "../services";


class LogController {
    async getLogs(req: Request, res: Response): Promise<void> {
        try {
            const logs = await logService.getLogs();
            responseHandlers.ok(res, logs);
        } catch (error) {
            responseHandlers.error(res);
        }
    }
}

export const logController = new LogController();
