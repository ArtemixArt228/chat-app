import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

import ChatBar from "../components/ChatBar";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";


import {Message} from "../types";
import UserGroupSection from "../components/UserGroupSection";
import ChatLayout from "../components/layout/ChatLayout";

interface ChatPageProps {
    socket: Socket;
}

const Chat: React.FC<ChatPageProps> = ({ socket }) => {
    const [messages, setMessages] = useState<Message[]>(
        JSON.parse(localStorage.getItem("messages") || "[]")
    );
    const [typingStatus, setTypingStatus] = useState("");
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleMessageResponse = (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.on("messageResponse", handleMessageResponse);

        return () => {
            socket.off("messageResponse", handleMessageResponse);
        };
    }, [socket]);

    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
            <ChatLayout socket={socket}/>
        </div>
    );
};

export default Chat;
