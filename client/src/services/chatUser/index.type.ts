export interface ICreateUserParams {
    username: string;
    socketID: string | undefined;
}

export interface IUpdateUserStatusParams {
    userId: string;
    isOnline: boolean;
}

export interface ILoginParams {
    username: string;
}

export interface ILogoutParams {
    sessionID: string;
}

export interface ICreateUserResponse {
    success: boolean;
    userId: string;
    username: string;
}

export interface IUpdateUserStatusResponse {
    success: boolean;
}

export interface ILoginResponse {
    success: boolean;
    sessionID: string;
}

export interface ILogoutResponse {
    success: boolean;
}
