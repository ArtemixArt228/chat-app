export interface IChatGroup {
    _id: string;
    name: string;
    members: Array<{
        _id: string;
        username: string;
    }>;
}
