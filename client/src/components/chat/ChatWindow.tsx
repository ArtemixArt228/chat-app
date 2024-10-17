import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

import VoiceRecorder from '../VoiceRecorder';

import { chatMessageService } from '../../services/chatMessage/index.service';
import { chatSessionService } from '../../services/chatSession/index.service';

import { ICreateMessageParams } from '../../services/chatMessage/index.type';
import { useSocket } from '../../context/SocketContext';
import { useUser } from '../../context/UserContext';

interface ChatWindowProps {
  groupId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const sessionID = localStorage.getItem('userSessionId');
  const { socket } = useSocket();
  const { user } = useUser();

  // Fetch group messages and listen for new messages via WebSocket
  const initializeChat = useCallback(async () => {
    try {
      const { response } = await chatMessageService.getMessages({ groupId });
      if (response) setMessages(response.data.messages);
    } catch {
      toast.error("Couldn't get group messages");
    }

    socket?.on('message', (message: ICreateMessageParams) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket?.off('message');
  }, [groupId, socket]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Validate session before sending a message
  const validateSession = async () => {
    if (!sessionID) {
      toast.warn('You are not authorized');
      return false;
    }

    try {
      const { response: isValid } = await chatSessionService.validateSession({
        sessionID,
      });
      return isValid;
    } catch {
      toast.error('Session validation failed');
      return false;
    }
  };

  // Common function to send a message
  const sendMessage = async (messageToSend: ICreateMessageParams) => {
    try {
      const { response } =
        await chatMessageService.createMessage(messageToSend);
      if (response) {
        setMessages((prevMessages) => [...prevMessages, messageToSend]);
        socket?.emit('sendMessage', { groupId, message: messageToSend });
        return true;
      }
    } catch {
      toast.error('Error sending message');
    }
    return false;
  };

  // Handle sending text message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageToSend: ICreateMessageParams = {
      sender: user._id,
      groupId,
      isVoiceMessage: false,
      content: newMessage,
      file: '',
    };

    if (await validateSession()) {
      if (await sendMessage(messageToSend)) setNewMessage('');
    }
  };

  // Handle sending voice message
  const handleVoiceMessage = async (blobUrl: string) => {
    const messageToSend: ICreateMessageParams = {
      sender: user._id,
      groupId,
      isVoiceMessage: true,
      content: '',
      file: blobUrl,
    };

    if (await validateSession()) {
      await sendMessage(messageToSend);
    }
  };

  // Render individual message
  const renderMessage = (message: any) => (
    <div key={message._id} className="mb-4">
      <div className="font-bold text-dark">{message.sender.username}</div>
      {message.isVoiceMessage ? (
        <audio
          controls
          src={`${process.env.REACT_APP_BASE_URL}/${message.fileUrl}`}
          className="mt-1 w-1/3 rounded-md"
        />
      ) : (
        <div className="mt-1 p-2 bg-white border border-gray-300 rounded-lg w-1/3 shadow-sm">
          {message.content}
        </div>
      )}
      <div className="text-sm text-gray-500 mt-1">
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-t-lg">
        {messages.length > 0 ? (
          messages.map(renderMessage)
        ) : (
          <div className="text-center text-gray-500">No messages</div>
        )}
      </div>
      <div className="p-4 border-t flex items-center bg-white rounded-b-lg shadow-inner">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300"
        >
          Send
        </button>
        <VoiceRecorder onStop={handleVoiceMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
