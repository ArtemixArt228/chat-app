import { Request, Response } from 'express';

import responseHandlers from '../handlers/response';

import {sessionService} from "../services";

class SessionController {
    async createSession(req: Request, res: Response) {
        const { userId } = req.body;

        try {
            const session = await sessionService.createOrUpdateSession(userId);
            responseHandlers.created(res, session);
        } catch (error) {
            console.error('Error creating or updating session:', error);
            responseHandlers.error(res);
        }
    }

    async validateSession(req: Request, res: Response) {
        const { sessionID } = req.params;

        try {
            const session = await sessionService.validateSession(sessionID);
            if (!session) {
                responseHandlers.unauthorized(res);
                return;
            }
            responseHandlers.ok(res, session);
        } catch (error) {
            responseHandlers.error(res);
        }
    }
}

export const sessionController = new SessionController();
