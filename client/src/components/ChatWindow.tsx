import React, { useEffect, useState } from 'react';
import { Socket } from "socket.io-client";
import { chatMessageService } from '../services/chatMessage/index.service';
import { ICreateMessageParams } from '../services/chatMessage/index.type';
import VoiceRecorder from './VoiceRecorder';
import { chatSessionService } from '../services/chatSession/index.service';


interface ChatWindowProps {
    groupId: string;
    socket: Socket;
    user: any
}

const ChatWindow: React.FC<ChatWindowProps> = ({ groupId, socket, user }) => {
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const sessionID = localStorage.getItem('userSessionId');

    useEffect(() => {
        const getGroupMessages = async () => {
            try {
                const { response } = await chatMessageService.getMessages({ groupId });
                if (response) {
                    setMessages(response);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getGroupMessages();

        socket.on('message', (message: ICreateMessageParams) => {
            setMessages((prevMessages: any) => [...prevMessages, message]);
        });

        return () => {
            socket.off('message');
        };
    }, [groupId, socket]);
    console.log(user)

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        const messageToSend: ICreateMessageParams = {
            sender: user._id,
            groupId,
            isVoiceMessage: false,
            content: newMessage,
            fileURL: ''
        };

        try {
            if (sessionID) {
                const { response: validateSessionResponse } = await chatSessionService.validateSession({ sessionID })
                if (validateSessionResponse) {
                    const { response } = await chatMessageService.createMessage(messageToSend);
                    if (response) {
                        setMessages((prevMessages: any) => [...prevMessages, messageToSend]);
                        socket.emit('sendMessage', { groupId, message: messageToSend });
                        setNewMessage('');
                    } else {
                        setNewMessage('');
                    }
                }
            }

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleVoiceMessage = async (blobUrl: string, blob: Blob) => {
        const fileURL = blobUrl;
        const messageToSend: ICreateMessageParams = {
            sender: user._id,
            groupId,
            isVoiceMessage: true,
            content: '',
            fileURL
        };

        try {
            if (sessionID) {
                const { response: validateSessionResponse } = await chatSessionService.validateSession({ sessionID })
                if (validateSessionResponse) {
                    const { response } = await chatMessageService.createMessage(messageToSend);
                    if (response) {
                        setMessages((prevMessages: any) => [...prevMessages, messageToSend]);
                        socket.emit('sendMessage', { groupId, message: messageToSend });
                    }
                }
            }
        } catch (error) {
            console.error('Error sending voice message:', error);
        }
    };
    console.log(messages)

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {messages.length > 0 ? (
                    messages.map((message: any) => (
                        <div key={message._id} className="mb-2">

                            <div className="font-bold">{message.sender.username}</div>
                            {message.isVoiceMessage ? (
                                <audio controls src={`${process.env.REACT_APP_BASE_URL}/${message.fileURL}`} />
                            ) : (
                                <div>{message.content}</div>
                            )}
                            <div className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleTimeString()}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500">Немає повідомлень</div>
                )}
            </div>
            <div className="p-4 border-t flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Напишіть повідомлення..."
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleSendMessage}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Надіслати
                </button>

                <VoiceRecorder onStop={handleVoiceMessage} />
            </div>
        </div>
    );
};

export default ChatWindow;
