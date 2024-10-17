import React, { useEffect, useRef, useState, useCallback } from "react";

import ChatLayout from "../components/chat/ChatLayout";

import { Message } from "../types";
import { useSocket } from "../context/SocketContext";

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(
        () => JSON.parse(localStorage.getItem("messages") || "[]")
    );
    const [typingStatus, setTypingStatus] = useState<string>("");
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const {socket} = useSocket()

    const handleMessageResponse = useCallback((data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
    }, []);

    const handleTypingResponse = useCallback((data: string) => {
        setTypingStatus(data);
    }, []);

    useEffect(() => {
        // Message response event listener
        socket?.on("messageResponse", handleMessageResponse);

        // Typing response event listener
        socket?.on("typingResponse", handleTypingResponse);

        // Clean up listeners unmount
        return () => {
            socket?.off("messageResponse", handleMessageResponse);
            socket?.off("typingResponse", handleTypingResponse);
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

    return <ChatLayout/>;
};

export default Chat;
