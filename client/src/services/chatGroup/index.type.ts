export interface ICreateGroupParams {
    groupName: string;
    members: string[];
    createdBy: string;
}

export interface IAddNewGroupParams {
    name: string;
    members: string[];
    createdBy: string;
}

export interface IGetGroupParams {
    groupId: string;
}

export interface IAddMemberParams {
    groupId: string;
    userId: string;
}
