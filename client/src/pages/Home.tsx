import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

import { chatUserService } from "../services/chatUser/index.service";

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
                const { response } = await chatUserService.login({ username });

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
                const { response} = await chatUserService.createUser({
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
        <div className="flex flex-col items-center justify-center h-screen bg-background">
            {!socketReady ? (
                <p className="text-lg text-gray-600">Waiting for socket connection...</p>
            ) : (
                <form
                    onSubmit={handleFormSubmit}
                    className="bg-light p-8 rounded-2xl shadow-lg w-full max-w-md transition-transform transform hover:scale-105 duration-300"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center text-dark">
                        {isUserRegistered ? "Login to the chat" : "Create a new account"}
                    </h2>
                    <input
                        placeholder="Username"
                        type="text"
                        minLength={6}
                        name="username"
                        id="username"
                        className="w-full p-4 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
                        value={username}
                        onChange={handleChangeUsername}
                    />
                    <button
                        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition duration-300 shadow-md"
                        type="submit"
                    >
                        {isUserRegistered ? "SIGN IN" : "REGISTER"}
                    </button>
                </form>
            )}
            <div className="mt-6">
                <button
                    className="text-primary hover:underline transition duration-200"
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
