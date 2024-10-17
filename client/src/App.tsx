import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Chat from './pages/Chat';
import { SocketProvider } from './context/SocketContext';
import { UserProvider } from './context/UserContext';


const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
    </Routes>
);

const App = () => (
    <>
        <SocketProvider>
            <UserProvider>
                <ToastContainer theme="light" limit={1} />
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </UserProvider>
        </SocketProvider>
    </>
);

export default App;
