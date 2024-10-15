import { v4 as uuidv4 } from 'uuid';

import { IUserRepository } from '../interfaces/user.interfaces';

import {userRepository} from "../repository";

class UserService {
    constructor(private userRepository: IUserRepository) {}

    async createUser(username: string, socketID: string) {
        const existingUser = await this.userRepository.findOne({ username });
        if (existingUser) {
            throw new Error('Username already taken');
        }

        const newUser = {
            username,
            socketID,
            sessionID: uuidv4(),
        };

        return await this.userRepository.create(newUser);
    }

    async getUsers() {
        return await this.userRepository.findAll();
    }

    async updateUserStatus(userId: string, isOnline: boolean) {
        return await this.userRepository.updateUser(userId, { isOnline });
    }

    async getUserBySessionID(sessionID: string) {
        const session = await this.userRepository.findOne({ sessionID });
        if (!session) {
            throw new Error('Session not found');
        }

        return await this.userRepository.findById(session.user._id);
    }
}

export const userService = new UserService(userRepository);
