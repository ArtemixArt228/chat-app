interface MessageData {
  sender: string;
  groupId: string;
  isVoiceMessage: boolean;
  content: string;
  file: Blob | null;
}

export const createFormDataForMessage = ({
  sender,
  groupId,
  isVoiceMessage,
  content,
  file,
}: MessageData): FormData => {
  const formData = new FormData();

  formData.append('sender', sender);
  formData.append('groupId', groupId);
  formData.append('isVoiceMessage', isVoiceMessage.toString());
  formData.append('content', content);

  if (file) {
    formData.append('file', file, 'recording.wav');
  }
  return formData;
};
