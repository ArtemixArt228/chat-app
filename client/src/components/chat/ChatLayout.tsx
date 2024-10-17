import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

import UserGroupSection from '../group/UserGroupSection';
import ChatWindow from './ChatWindow';
import { useSocketContext } from '../../context/SocketContext';
import { useUserContext } from '../../context/UserContext';

const ChatLayout: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { socket } = useSocketContext();
  const { user, fetchUser } = useUserContext();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle group selection
  const handleGroupSelect = useCallback((groupId: string) => {
    setSelectedGroupId(groupId);
  }, []);

  // Render main content based on group selection state
  const renderChatContent = useCallback(() => {
    if (selectedGroupId) {
      return <ChatWindow groupId={selectedGroupId} />;
    }
    return (
      <div className="text-center text-gray-500 text-lg">
        Select a group to start chatting
      </div>
    );
  }, [selectedGroupId, socket, user]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-1/3 border-r border-gray-300 p-6 bg-light shadow-lg">
        <UserGroupSection onGroupSelect={handleGroupSelect} />
      </aside>
      <main className="flex-1 p-6 flex items-center justify-center bg-gray-50">
        {renderChatContent()}
      </main>
    </div>
  );
};

export default ChatLayout;
