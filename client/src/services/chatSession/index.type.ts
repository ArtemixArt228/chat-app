export interface ICreateSessionParams {
    userId: string;
    sessionID: string;
}

export interface IValidateSessionParams {
    sessionID: string;
}

export interface ICreateSessionResponse {
    success: boolean;
    sessionID: string;
    userId: string;
    createdAt: string;
}

export interface IValidateSessionResponse {
    isValid: boolean;
    sessionID: string;
    userId: string;
}
