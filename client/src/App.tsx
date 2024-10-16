import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home';
import Chat from './pages/Chat';

import 'react-toastify/dist/ReactToastify.css';

const socket = io(process.env.REACT_APP_BASE_URL);

function App() {
    return (
        <>
            <ToastContainer theme="dark" />
            <BrowserRouter>
                <div>
                    <Routes>
                        <Route path="/" element={<Home socket={socket} />} />
                        <Route path="/chat" element={<Chat socket={socket} />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    );
}

export default App;
