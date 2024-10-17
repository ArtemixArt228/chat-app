import { useState, useCallback } from 'react';
import { chatMessageService } from '../services/chatMessage/index.service';
import { toast } from 'react-toastify';

export const useChatMessages = (groupId: string) => {
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = useCallback(async () => {
    try {
      const { response } = await chatMessageService.getMessages({ groupId });
      if (response) setMessages(response);
    } catch {
      toast.error("Couldn't get group messages");
    }
  }, [groupId]);

  const addMessage = useCallback(async (formData: FormData) => {
    try {
      const { response } = await chatMessageService.createMessage(formData);
      if (response) {
        setMessages((prevMessages) => [...prevMessages, response]);
        return true;
      }
    } catch {
      toast.error('Error sending message');
    }
    return false;
  }, []);

  return {
    messages,
    fetchMessages,
    addMessage,
  };
};
