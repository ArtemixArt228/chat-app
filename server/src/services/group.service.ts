import {groupRepository, logRepository} from "../repository";

import {IGroupRepository} from "../interfaces/group.interfaces";
import {ILogRepository} from "../interfaces/log.interfaces";

class GroupService {
    constructor(
        private groupRepository: IGroupRepository,
        private logRepository: ILogRepository
    ) {}

    async createGroup(name: string, members: string[], createdBy: string) {
        const newGroup = await this.groupRepository.createGroup({ name, members, createdBy });
        await this.logRepository.createLog(
            'create_group',
            `Group ${name} created by user ${createdBy}`,
            createdBy
        );
        return newGroup;
    }

    async getGroupById(groupId: string) {
        return await this.groupRepository.findById(groupId);
    }


    async getGroups() {
        return await this.groupRepository.getAllGroups();
    }

    async addMember(groupId: string, userId: string) {
        return await this.groupRepository.addMemberToGroup(groupId, userId);
    }
}

export const groupService = new GroupService(groupRepository, logRepository);
