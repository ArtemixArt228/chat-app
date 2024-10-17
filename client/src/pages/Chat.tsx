import React, { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";

import ChatLayout from "../components/chat/ChatLayout";

import { Message } from "../types";

interface ChatPageProps {
    socket: Socket;
}

const Chat: React.FC<ChatPageProps> = ({ socket }) => {
    const [messages, setMessages] = useState<Message[]>(
        () => JSON.parse(localStorage.getItem("messages") || "[]")
    );
    const [typingStatus, setTypingStatus] = useState<string>("");
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    // Memoized function to handle message updates
    const handleMessageResponse = useCallback((data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
    }, []);

    // Memoized function to handle typing status updates
    const handleTypingResponse = useCallback((data: string) => {
        setTypingStatus(data);
    }, []);

    useEffect(() => {
        // Message response event listener
        socket.on("messageResponse", handleMessageResponse);

        // Typing response event listener
        socket.on("typingResponse", handleTypingResponse);

        // Clean up listeners unmount
        return () => {
            socket.off("messageResponse", handleMessageResponse);
            socket.off("typingResponse", handleTypingResponse);
        };
    }, [socket, handleMessageResponse, handleTypingResponse]);

    // Store messages in localStorage when they change
    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages]);

    // Scroll to the latest message when messages are updated
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return <ChatLayout socket={socket} />;
};

export default Chat;
