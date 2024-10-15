import {authRepository} from "../repository";

import {IAuthRepository} from "../interfaces/auth.interfaces";

class AuthService {
    constructor(private authRepository: IAuthRepository) {}

    async getUserByUsername(username: string) {
        return await this.authRepository.findByUsername(username);
    }
}

export const authService = new AuthService(authRepository);

