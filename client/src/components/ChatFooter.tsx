import React, { useState, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import {Socket} from "socket.io-client";
import { toast } from "react-toastify";

interface ChatFooterProps {
    socket: Socket;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ socket }) => {
    const [message, setMessage] = useState<string>('');

    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();

    const handleTyping = (e: KeyboardEvent<HTMLInputElement>) => {
        const userName = localStorage.getItem('userName');
        if (userName && e.key !== 'Enter') {
            socket.emit('typing', `${userName} writes a message`);
        } else {
            socket.emit('typing', '');
        }
    };

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userName = localStorage.getItem('userName');
        socket.emit('typing', '');

        if (message.trim() && userName) {
            socket.emit('message', {
                text: message,
                name: userName,
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
                time: `${hour}:${min < 10 ? '0' : ''}${min}` 
            });
            toast.success('Message sent successfully!');
            setMessage('');
        } else {
            toast.error('Error! Please check the message.');
        }
    };

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    return (
        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Write message"
                    className="message"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleTyping}
                />
                <button type="submit" className="sendBtn">SEND</button>
            </form>
        </div>
    );
};

export default ChatFooter;
