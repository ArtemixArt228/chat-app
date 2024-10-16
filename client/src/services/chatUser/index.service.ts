import { HttpService } from "../http.service";
import { HttpServiceFactory } from "../index";

import { IResponse } from "../../types";

import { ICreateUserParams, IUpdateUserStatusParams, ILoginParams, ILogoutParams, ICreateUserResponse, IUpdateUserStatusResponse, ILoginResponse, ILogoutResponse, IGetUserParams } from "./index.type";

export class ChatUserService {

    constructor(private httpService: HttpService) {}

    public async createUser({ username, socketID }: ICreateUserParams) {
        try {
            const response = await this.httpService.post<IResponse<ICreateUserResponse>, ICreateUserParams>(
                'users',
                { username, socketID }
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }

    public async getUsers() {
        try {
            const response = await this.httpService.get<IResponse<ICreateUserResponse[]>>(
                'users'
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }

    public async getUser({sessionID}: IGetUserParams) {
        try {
            const response = await this.httpService.get<IResponse<ICreateUserResponse>>(
                `users/${sessionID}`
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }

    public async updateUserStatus({ userId, isOnline }: IUpdateUserStatusParams) {
        try {
            const response = await this.httpService.post<IResponse<IUpdateUserStatusResponse>, IUpdateUserStatusParams>(
                'users/status',
                { userId, isOnline }
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }

    public async login({ username }: ILoginParams) {
        try {
            const response = await this.httpService.post<IResponse<ILoginResponse>, ILoginParams>(
                'users/login',
                { username }
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }

    public async logout({ sessionID }: ILogoutParams) {
        try {
            const response = await this.httpService.post<IResponse<ILogoutResponse>, ILogoutParams>(
                'users/logout',
                { sessionID }
            );
            return { response };
        } catch (error) {
            return { error };
        }
    }
}

// Initialize the service
const factory = new HttpServiceFactory();
export const chatUserService = new ChatUserService(factory.createHttpService());
