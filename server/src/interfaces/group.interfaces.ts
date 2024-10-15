export interface IGroupRepository {
    createGroup(data: { name: string; members: string[]; createdBy: string }): Promise<any>;
    findById(groupId: string): Promise<any>;
    getAllGroups(): Promise<any>;
    addMemberToGroup(groupId: string, userId: string): Promise<any>;
}
