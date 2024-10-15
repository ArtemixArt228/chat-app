import groupModel from "../models/group.model";

import {IGroupRepository} from "../interfaces/group.interfaces";


class GroupRepository implements IGroupRepository {
    async createGroup(data: { name: string; members: string[]; createdBy: string }) {
        const newGroup = await groupModel.create(data);
        await newGroup.save();
        return newGroup;
    }

    async findById(groupId: string) {
        return groupModel.findById(groupId).populate('members', 'username');
    }

    async getAllGroups() {
        return groupModel.find().populate('members', 'username');;
    }

    async addMemberToGroup(groupId: string, userId: string) {
        return groupModel.findByIdAndUpdate(
            groupId,
            {$addToSet: {members: userId}},
            {new: true}
        );
    }
}

export const groupRepository = new GroupRepository();

