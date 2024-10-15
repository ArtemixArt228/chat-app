import { Request, Response } from "express";

import responseHandlers from "../handlers/response";

import { groupService } from "../services";

class GroupController {
    async createGroup(req: Request, res: Response): Promise<void> {
        const { name, members, createdBy } = req.body;

        if (!name || !members || !createdBy) {
            responseHandlers.badRequest(res, "Missing required fields");
            return;
        }

        try {
            const newGroup = await groupService.createGroup(name, members, createdBy);
            responseHandlers.created(res, newGroup);
        } catch (error) {
            responseHandlers.error(res);
        }
    }

    async getGroup(req: Request, res: Response): Promise<void> {
        const { groupId } = req.params;

        try {
            const group = await groupService.getGroupById(groupId);
            if (!group) {
                responseHandlers.notFound(res, 'Group not found');
                return; // Return after sending the response
            }
            responseHandlers.ok(res, group);
        } catch (error) {
            responseHandlers.error(res);
        }
    }

    async addMember(req: Request, res: Response): Promise<void> {
        const { groupId, userId } = req.body;

        if (!groupId || !userId) {
            responseHandlers.badRequest(res, "Missing required fields");
            return;
        }

        try {
            const group = await groupService.addMember(groupId, userId);
            if (!group) {
                responseHandlers.notFound(res, 'Group not found');
                return; // Return after sending the response
            }
            responseHandlers.ok(res, group);
        } catch (error) {
            responseHandlers.error(res);
        }
    }

    async getGroups(req: Request, res: Response): Promise<void> {
        try {
            const groups = await groupService.getGroups()

            if (groups.length === 0) {
                responseHandlers.notFound(res, 'No groups found');
                return;
            }

            responseHandlers.ok(res, groups);
        } catch (error) {
            responseHandlers.error(res)
        }
    }
}

export const groupController = new GroupController();
