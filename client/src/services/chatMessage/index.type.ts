export interface ICreateMessageParams {
  sender: string;
  content: string;
  groupId: string;
  isVoiceMessage?: boolean;
  file?: string;
}

export interface IGetMessagesParams {
  groupId: string;
}

export interface IMessage {
  id: string;
  sender: string;
  content: string;
  groupId: string;
  isVoiceMessage: boolean;
  fileURL?: string;
  createdAt: string;
}
