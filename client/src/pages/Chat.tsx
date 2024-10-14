import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

import ChatBar from "../components/ChatBar";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";


import {Message} from "../types";

interface ChatPageProps {
    socket: Socket;
}

const Chat: React.FC<ChatPageProps> = ({ socket }) => {
    const [messages, setMessages] = useState<Message[]>(
        JSON.parse(localStorage.getItem("messages") || "[]")
    );
    const [typingStatus, setTypingStatus] = useState("");
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    // Update messages when a new message is received
    useEffect(() => {
        const handleMessageResponse = (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.on("messageResponse", handleMessageResponse);

        return () => {
            socket.off("messageResponse", handleMessageResponse);
        };
    }, [socket]);

    // Update localStorage whenever messages change
    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages]);

    // Scroll to the bottom when messages change
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Update typing status
    useEffect(() => {
        const handleTypingResponse = (data: string) => {
            setTypingStatus(data);
        };

        socket.on("typingResponse", handleTypingResponse);

        return () => {
            socket.off("typingResponse", handleTypingResponse);
        };
    }, [socket]);

    return (
        <div className="chat">
            <ChatBar socket={socket} />
            <div className="chat__main">
                <ChatBody
                    messages={messages}
                    lastMessageRef={lastMessageRef}
                    typingStatus={typingStatus}
                />
                <ChatFooter socket={socket} />
            </div>
        </div>
    );
};

export default Chat;
