import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { chatUserService } from "../services/chatUser/index.service";
import { toast } from "react-toastify";

interface HomeProps {
    socket: Socket;
}

const Home: React.FC<HomeProps> = ({ socket }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [isUserRegistered, setIsUserRegistered] = useState(true);
    const [socketReady, setSocketReady] = useState(false);

    useEffect(() => {
        const checkSocketReady = () => {
            setSocketReady(!!socket.id);
        };

        checkSocketReady();
        socket.on("connect", checkSocketReady);

        return () => {
            socket.off("connect", checkSocketReady);
        };
    }, [socket]);

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!username.trim()) {
            toast.error("Please enter a username");
            return;
        }

        if (!socketReady) {
            toast.error("Socket connection not established. Please try again.");
            return;
        }

        if (isUserRegistered) {
            try {
                const { response, error } = await chatUserService.login({ username });

                if (response) {
                    let sessionID: string;

                    if (typeof response === 'string') {
                        sessionID = response;
                    } else if (response.data) {
                        sessionID = response.data;
                    } else {
                        toast.error("Unexpected response format.");
                        return;
                    }

                    socket.emit("newUser", { username, socketID: socket.id });
                    localStorage.setItem('userSessionId', sessionID);
                    navigate("/chat");
                } else {
                    toast.error("User not found!");
                }
            } catch (e) {
                toast.error("An error occurred while logging in.");
            }
        } else {
            try {
                const { response, error } = await chatUserService.createUser({
                    username,
                    socketID: socket.id,
                });

                if (response) {
                    setIsUserRegistered(true);
                    toast.success("User successfully registered! You can now log in.");
                }
            } catch (e) {
                toast.error("An error occurred while registering.");
            }
        }
    };

    const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {!socketReady ? (
                <p className="text-lg text-gray-600">Waiting for socket connection...</p>
            ) : (
                <form
                    onSubmit={handleFormSubmit}
                    className="bg-white p-6 rounded shadow-md w-full max-w-md"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        {isUserRegistered ? "Login to the chat" : "Create a new account"}
                    </h2>
                    <input
                        placeholder="Username"
                        type="text"
                        minLength={6}
                        name="username"
                        id="username"
                        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={handleChangeUsername}
                    />
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                        type="submit"
                    >
                        {isUserRegistered ? "SIGN IN" : "REGISTER"}
                    </button>
                </form>
            )}
            <div className="mt-4">
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setIsUserRegistered(!isUserRegistered)}
                >
                    {isUserRegistered
                        ? "Need an account? Register"
                        : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
};

export default Home;