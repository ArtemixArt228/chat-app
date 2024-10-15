import { HttpService } from "../http.service";
import { HttpServiceFactory } from "../index";

import { IResponse } from "../../types";

import { ICreateMessageParams, IGetMessagesParams, IGetMessagesResponse } from "./index.type";

export class ChatMessageService {
    constructor(private httpService: HttpService) {}

    public async createMessage({ sender, content, groupId, isVoiceMessage, fileURL }: ICreateMessageParams) {
        try {
            const response = await this.httpService.post<IResponse, ICreateMessageParams>(
                "messages",
                { sender, content, groupId, isVoiceMessage, fileURL }
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }

    public async getMessages({ groupId }: IGetMessagesParams) {
        try {
            const response = await this.httpService.get<IResponse<IGetMessagesResponse>>(
                `messages/${groupId}`
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }
}

const factory = new HttpServiceFactory();
export const chatMessageService = new ChatMessageService(factory.createHttpService());
