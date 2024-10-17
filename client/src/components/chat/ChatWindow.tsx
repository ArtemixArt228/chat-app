import React, { useEffect, useState } from 'react';
import { LuPaperclip } from 'react-icons/lu';

import VoiceRecorder from '../VoiceRecorder';

import { useChatMessages, useSessionValidation } from '../../hooks';

import { useSocketContext, useUserContext } from '../../context';

import { createFormDataForMessage } from '../../utils';

interface ChatWindowProps {
  groupId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ groupId }) => {
  const { messages, addMessage, fetchMessages } = useChatMessages(groupId);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const validateSession = useSessionValidation();

  // Initialize chat
  useEffect(() => {
    fetchMessages();

    const handleNewMessage = (message: any) => addMessage(message);

    // Add event listener
    socket?.on('message', handleNewMessage);

    // Return a cleanup function to remove the event listener
    return () => {
      socket?.off('message', handleNewMessage);
    };
  }, [fetchMessages, socket, addMessage]);

  // Handle sending a text message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    const formData = createFormDataForMessage({
      sender: user._id,
      groupId,
      isVoiceMessage: false,
      isImage: !!selectedImage,
      content: newMessage,
      file: selectedImage,
    });

    if (await validateSession()) {
      if (await addMessage(formData)) {
        setNewMessage('');
        setSelectedImage(null);
      }
    }
  };

  // Handle sending a voice message
  const handleVoiceMessage = async (_: string, blob: Blob) => {
    const formData = createFormDataForMessage({
      sender: user._id,
      groupId,
      isVoiceMessage: true,
      isImage: false,
      content: '',
      file: blob,
    });

    if (await validateSession()) {
      await addMessage(formData);
    }
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedImage(file);
    }
  };

  // Render individual message
  const renderMessage = (message: any) => (
    <div key={message._id} className="mb-4">
      <div className="font-bold text-dark">{message.sender.username}</div>
      {message.isVoiceMessage ? (
        <audio
          controls
          src={message.fileUrl}
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
      <div className="p-4 border-t flex gap-2 items-center bg-white rounded-b-lg shadow-inner">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelection}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="bg-primary h-full text-white py-2 px-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-secondary transition duration-300"
        >
          <LuPaperclip />
        </label>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300"
        >
          Send
        </button>
        <VoiceRecorder onStop={handleVoiceMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
