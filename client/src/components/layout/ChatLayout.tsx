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
    console.log(user)

    useEffect(() => {
        const getUser = async () => {
            try {
                const sessionID = localStorage.getItem('userSessionId');

                if (sessionID) {
                    const { response, error } = await chatUserService.getUser({ sessionID });

                    if (response) {
                        setUser(response);
                    } else if (error) {
                        console.error('Error fetching user:', error);
                    }
                } else {
                    console.log('No sessionID found in localStorage');
                }
            } catch (error) {
                console.log('Error in getUser:', error);
            }
        };

        getUser();
    }, []);

    const handleGroupSelect = (groupId: string) => {
        setSelectedGroupId(groupId);
    };

    return (
        <div className="flex max-h-screen overflow-hidden">
            <div className="w-1/3 border-r p-4 ">
                <UserGroupSection onGroupSelect={handleGroupSelect} user={user}/>
            </div>
            <div className="flex-1 p-4">
                {selectedGroupId ? (
                    <ChatWindow groupId={selectedGroupId} socket={socket} user={user}/>
                ) : (
                    <div className="text-center text-gray-500">Виберіть групу для чату</div>
                )}
            </div>
        </div>
    );
};

export default ChatLayout;
