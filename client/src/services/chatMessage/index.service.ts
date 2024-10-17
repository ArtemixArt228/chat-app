import { HttpService } from '../http.service';
import { HttpServiceFactory } from '../index';

import { IResponse } from '../../types';

import {
  ICreateMessageParams,
  IGetMessagesParams,
  IMessage,
} from './index.type';

export class ChatMessageService {
  constructor(private httpService: HttpService) {}

  public async createMessage(messageFormData: FormData) {
    try {
      const response = await this.httpService.post<IResponse, FormData>(
        'messages',
        messageFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return { response };
    } catch (error) {
      return { error };
    }
  }

  public async getMessages({ groupId }: IGetMessagesParams) {
    try {
      const response = await this.httpService.get<IMessage[]>(
        `messages/${groupId}`,
      );
      return { response };
    } catch (error) {
      return { error };
    }
  }
}

const factory = new HttpServiceFactory();
export const chatMessageService = new ChatMessageService(
  factory.createHttpService(),
);
