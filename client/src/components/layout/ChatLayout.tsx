import React, { useEffect, useState } from 'react';
import { Socket } from "socket.io-client";

import UserGroupSection from '../UserGroupSection';
import ChatWindow from '../ChatWindow';

import { chatUserService } from '../../services/chatUser/index.service';

interface ChatLayoutProps {
    socket: Socket;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ socket }) => {
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const sessionID = localStorage.getItem('userSessionId');
            if (!sessionID) {
                console.warn('No session ID found in localStorage');
                return;
            }

            try {
                const { response, error } = await chatUserService.getUser({ sessionID });
                if (response) {
                    setUser(response);
                } else if (error) {
                    console.error('Error fetching user:', error);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };

        fetchUser();
    }, []);

    const handleGroupSelect = (groupId: string) => setSelectedGroupId(groupId);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <aside className="w-1/3 border-r border-gray-300 p-4 bg-white">
                <UserGroupSection onGroupSelect={handleGroupSelect} user={user} />
            </aside>
            <main className="flex-1 p-4 flex items-center justify-center bg-gray-50">
                {selectedGroupId ? (
                    <ChatWindow groupId={selectedGroupId} socket={socket} user={user} />
                ) : (
                    <div className="text-center text-gray-500 text-lg">
                        Select a group to start chatting
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChatLayout;
