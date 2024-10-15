import userModel from "../models/user.model";

import {IAuthRepository} from "../interfaces/auth.interfaces";

class AuthRepository implements IAuthRepository {
    public async findByUsername(username: string) {
        return userModel.findOne({ username });
    }
}

export const authRepository = new AuthRepository();
