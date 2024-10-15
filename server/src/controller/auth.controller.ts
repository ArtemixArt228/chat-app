import { Request, Response } from "express";

import {authService, sessionService} from "../services";

import responseHandlers from "../handlers/response";

class AuthController {
    public async login(req: Request, res: Response) {
        const { username } = req.body;

        if (!username) {
            responseHandlers.badRequest(res, "Username is required");
            return;
        }

        try {
            const user = await authService.getUserByUsername(username);
            if (!user) {
                responseHandlers.unauthorized(res);
                return;
            }

            const sessionID = `${user._id}-${Date.now()}`;
            await sessionService.createSession(user._id, sessionID, +(process.env.SESSION_EXPIRATION || 3600000));

            responseHandlers.ok(res, { sessionID });
            return;
        } catch (error) {
            responseHandlers.error(res);
            return;
        }
    }

    public async logout(req: Request, res: Response) {
        const { sessionID } = req.body;

        if (!sessionID) {
            responseHandlers.badRequest(res, "Session ID is required");
            return;
        }

        try {
            const result = await sessionService.deleteSession(sessionID);
            if (result.deletedCount === 0) {
                responseHandlers.notFound(res, "Session not found");
                return;
            }

            responseHandlers.ok(res, "Logged out successfully");
            return;
        } catch (error) {
            responseHandlers.error(res);
            return;
        }
    }
}

export const authController = new AuthController();
