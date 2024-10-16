import { HttpService } from "../http.service";
import { HttpServiceFactory } from "../index";

import { IResponse } from "../../types";

import { ICreateSessionParams, IValidateSessionParams, ICreateSessionResponse, IValidateSessionResponse } from "./index.type";

export class ChatSessionService {
    constructor(private httpService: HttpService) {}

    // Method to create a session
    public async createSession({ userId, sessionID }: ICreateSessionParams) {
        try {
            const response = await this.httpService.post<IResponse<ICreateSessionResponse>, ICreateSessionParams>(
                "sessions",
                { userId, sessionID }
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }

    // Method to validate a session
    public async validateSession({ sessionID }: IValidateSessionParams) {
        try {
            const response = await this.httpService.get<IResponse<IValidateSessionResponse>>(
                `sessions/${sessionID}`
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }
}

// Initialize the service
const factory = new HttpServiceFactory();
export const chatSessionService = new ChatSessionService(factory.createHttpService());
