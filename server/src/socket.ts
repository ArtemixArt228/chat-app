import { Server, Socket } from 'socket.io';

interface MessageData {
    username: string;
    message: string;
}

interface TypingData {
    username: string;
}

export const setupSocketIO = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        // Listen for a new message
        socket.on('message', (data: MessageData) => {
            io.emit('messageResponse', data);
        });

        // Broadcast typing event
        socket.on('typing', (data: TypingData) => {
            socket.broadcast.emit('typingResponse', data);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            io.emit('userDisconnected', { socketID: socket.id });
        });
    });
};
