import { HttpService } from "../http.service";
import { HttpServiceFactory } from "../index";

import { IResponse } from "../../types";

import { IAddMemberParams, IAddNewGroupParams, ICreateGroupParams, IGetGroupParams } from "./index.type";

export class ChatGroupService {
    constructor(private httpService: HttpService) { }

    public async createGroup({ groupName, members, createdBy, }: ICreateGroupParams) {
        try {
            const response = await this.httpService.post<
                IResponse,
                IAddNewGroupParams
            >("groups", { name: groupName, members, createdBy });
            return { response };
        } catch (error) {
            return { error };
        }
    }

    public async getGroup({ groupId }: IGetGroupParams) {
        try {
            const response = await this.httpService.get<IResponse>(
                `groups/${groupId}`
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }

    public async getGroups() {
        try {
            const response = await this.httpService.get<IResponse>(
                `groups`
            );
            return { response }
        } catch (error) {
            return { error }
        }
    }

    public async addMember({ groupId, userId }: IAddMemberParams) {
        try {
            const response = await this.httpService.put<IResponse, IAddMemberParams>(
                "groups/addMember",
                { groupId, userId }
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }
}

const factory = new HttpServiceFactory();
export const chatGroupService = new ChatGroupService(
    factory.createHttpService()
);
