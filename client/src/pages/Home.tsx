import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

import {chatUserService} from "../services/chatUser/index.service";

interface HomeProps {
    socket: Socket;
}

const Home: React.FC<HomeProps> = ({ socket }) => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [isUserRegistered, setIsUserRegistered] = useState(true);
    const [socketReady, setSocketReady] = useState(false);

    // Check socket connection status
    useEffect(() => {
        const checkSocketReady = () => {
            setSocketReady(!!socket.id);
        };

        checkSocketReady(); // Initial check
        socket.on("connect", checkSocketReady);

        return () => {
            socket.off("connect", checkSocketReady); // Clean up listener
        };
    }, [socket]);

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!username.trim()) {
            alert("Please enter a username");
            return;
        }

        if (!socketReady) {
            alert("Socket connection not established. Please try again.");
            return;
        }

        if (isUserRegistered) {
            // Handle login
            try {
                await chatUserService.login({ username });
            } catch (e) {
                return;
            }

            socket.emit("newUser", { username, socketID: socket.id });
            navigate("/chat");
        } else {
            // Handle registration
            try {
                await chatUserService.createUser({
                    username,
                    socketID: socket.id,
                });
            } catch (e) {
                return;
            }

            setIsUserRegistered(true);
            alert("User successfully registered! You can now log in.");
        }
    };

    const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    return (
        <div className="home__container">
            {!socketReady ? (
                <p>Waiting for socket connection...</p>
            ) : (
                <form onSubmit={handleFormSubmit}>
                    <h2 className="home__header">
                        {isUserRegistered ? "Login to the chat" : "Create a new account"}
                    </h2>
                    <input
                        placeholder="Username"
                        type="text"
                        minLength={6}
                        name="username"
                        id="username"
                        className="username__input"
                        value={username}
                        onChange={handleChangeUsername}
                    />
                    <button className="home__cta" type="submit">
                        {isUserRegistered ? "SIGN IN" : "REGISTER"}
                    </button>
                </form>
            )}
            <div>
                <button
                    className="toggle__cta"
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
