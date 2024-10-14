import React, { MutableRefObject } from 'react';
import { useNavigate } from 'react-router-dom';

import {Message} from "../types";

interface ChatBodyProps {
    messages: Message[];
    lastMessageRef: MutableRefObject<HTMLDivElement | null>;
    typingStatus: string;
}

const ChatBody: React.FC<ChatBodyProps> = ({ messages, lastMessageRef, typingStatus }) => {
    const navigate = useNavigate();

    const handleLeaveChat = () => {
        localStorage.removeItem('userName');
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            <header className="chat__mainHeader">
                <div className="message__status">
                    <p>{typingStatus}</p>
                </div>
                <button className="leaveChat__btn" onClick={handleLeaveChat}>
                    LEAVE CHAT
                </button>
            </header>

            <div className="message__container">
                {messages.map((message) =>
                    message.user === localStorage.getItem('userName') ? (
                        <div className="message__chats" key={message.id}>
                            <p className="sender__name">You</p>
                            <div className="message__sender" style={{ position: 'relative' }}>
                                <p>{message.text}</p>
                                <p>{message.timestamp}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="message__chats" key={message.id}>
                            <p>{message.user}</p>
                            <div className="message__recipient">
                                <p>{message.text}</p>
                                <p>{message.timestamp}</p>
                            </div>
                        </div>
                    )
                )}
                <div ref={lastMessageRef} />
            </div>
        </>
    );
};

export default ChatBody;
