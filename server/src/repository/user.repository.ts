import userModel from "../models/user.model";

import {IUserRepository} from "../interfaces/user.interfaces";


class UserRepository implements IUserRepository {
    async findOne(query: any) {
        return userModel.findOne(query).exec();
    }

    async create(data: any) {
        const user = new userModel(data);
        return user.save();
    }

    async findAll() {
        return userModel.find().exec();
    }

    async findById(userId: string) {
        return userModel.findById(userId).exec();
    }

    async updateUser(userId: string, updateData: any) {
        return userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    }
}

export const userRepository = new UserRepository();
