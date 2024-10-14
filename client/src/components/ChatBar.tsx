import React, { useEffect, useState } from "react";
import {Socket} from "socket.io-client";

interface User {
    socketID: string;
    userName: string;
}

interface ChatBarProps {
    socket: Socket;
}

const ChatBar: React.FC<ChatBarProps> = ({ socket }) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const handleNewUserResponse = (data: User[]) => {
            setUsers(data);
        };

        socket.on('newUserResponse', handleNewUserResponse);

        // Cleanup listener on unmount
        return () => {
            socket.off('newUserResponse', handleNewUserResponse);
        };
    }, [socket]);

    return (
        <div className="chat__sidebar">
            <div>
                <h4 className="chat__header">
                    ACTIVE USERS {users.length > 0 ? `(${users.length})` : ''}
                </h4>
                <div className="chat__users">
                    {users.map((user) => (
                        <p className="user_item" key={user.socketID}>{user.userName}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatBar;
