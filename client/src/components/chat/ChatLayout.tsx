import React, { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

import UserGroupSection from '../group/UserGroupSection';
import ChatWindow from './ChatWindow';
import { chatUserService } from '../../services/chatUser/index.service';

interface ChatLayoutProps {
    socket: Socket;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ socket }) => {
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // Fetch user data based on session ID
    const fetchUser = useCallback(async () => {
        const sessionID = localStorage.getItem('userSessionId');
        if (!sessionID) {
            toast.warn('You are not authorized');
            return;
        }

        try {
            const { response, error } = await chatUserService.getUser({ sessionID });
            if (response) {
                setUser(response);
            } else {
                toast.error(`Error fetching user: ${error || 'Unknown error'}`);
            }
        } catch (err) {
            toast.error('Failed to fetch user. Please try again later.');
        }
    }, []);

    // Fetch user on component mount
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
            return <ChatWindow groupId={selectedGroupId} socket={socket} user={user} />;
        }
        return <div className="text-center text-gray-500 text-lg">Select a group to start chatting</div>;
    }, [selectedGroupId, socket, user]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <aside className="w-1/3 border-r border-gray-300 p-6 bg-light shadow-lg">
                <UserGroupSection onGroupSelect={handleGroupSelect} user={user} />
            </aside>
            <main className="flex-1 p-6 flex items-center justify-center bg-gray-50">
                {renderChatContent()}
            </main>
        </div>
    );
};

export default ChatLayout;
