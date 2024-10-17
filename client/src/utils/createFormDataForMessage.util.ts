interface MessageData {
  sender: string;
  groupId: string;
  isVoiceMessage: boolean;
  isImage: boolean;
  content: string;
  file: Blob | null | File;
}

export const createFormDataForMessage = ({
  sender,
  groupId,
  isVoiceMessage,
  isImage,
  content,
  file,
}: MessageData): FormData => {
  const formData = new FormData();

  const fileName = file instanceof File ? file.name : 'recording.wav';

  formData.append('sender', sender);
  formData.append('groupId', groupId);
  formData.append('isVoiceMessage', isVoiceMessage.toString());
  formData.append('isImage', isImage.toString());
  formData.append('content', content);

  if (file) {
    formData.append('file', file, fileName);
  }

  return formData;
};
