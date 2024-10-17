import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Chat from './pages/Chat';

const socket = io(process.env.REACT_APP_BASE_IO);

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/chat" element={<Chat socket={socket} />} />
    </Routes>
);

const App = () => (
    <>
        <ToastContainer theme="light" limit={1} />
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </>
);

export default App;
