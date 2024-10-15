// src/interfaces/user.interfaces.ts
export interface IUserRepository {
    findOne(query: any): Promise<any>;
    create(data: any): Promise<any>;
    findAll(): Promise<any[]>;
    findById(userId: string): Promise<any>;
    updateUser(userId: string, updateData: any): Promise<any>;
}
