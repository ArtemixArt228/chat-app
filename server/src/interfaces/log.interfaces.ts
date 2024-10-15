export interface ILogRepository {
    createLog(action: string, description: string, user: string): Promise<void>;
    getAllLogs(): Promise<any>;
}
