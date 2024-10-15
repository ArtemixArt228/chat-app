import { Request, Response } from 'express';

import responseHandlers from '../handlers/response';

import { userService} from "../services";

import {logRepository} from "../repository";


class UserController {
    async createUser(req: Request, res: Response) {
        const { username, socketID } = req.body;

        try {
            const savedUser = await userService.createUser(username, socketID);
            await logRepository.createLog(
                'register_user',
                `User ${username} registered`,
                savedUser._id,
            );
            responseHandlers.created(res, savedUser);
        } catch (error: any) {
            responseHandlers.badRequest(res, error.message);
        }
    }

    async getUsers(_: Request, res: Response) {
        try {
            const users = await userService.getUsers();
            responseHandlers.ok(res, users);
        } catch (error) {
            responseHandlers.error(res);
        }
    }

    async updateUserStatus(req: Request, res: Response) {
        const { userId, isOnline } = req.body;
        try {
            const user = await userService.updateUserStatus(userId, isOnline);
            if (!user) {
                responseHandlers.notFound(res, 'User not found');
                return;
            }
            responseHandlers.ok(res, user);
        } catch (error) {
            responseHandlers.error(res);
        }
    }

    async getUser(req: Request, res: Response) {
        const { sessionID } = req.params;

        try {
            const user = await userService.getUserBySessionID(sessionID);
            if (!user) {
                responseHandlers.notFound(res, 'User not found');
                return;
            }
            responseHandlers.ok(res, user);
        } catch (error) {
            responseHandlers.error(res);
        }
    }
}

export const userController = new UserController();
