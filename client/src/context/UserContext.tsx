import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { chatUserService } from '../services/chatUser/index.service';


interface UserContextType {
    user: any;
    fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    const fetchUser = useCallback(async () => {
        const sessionID = localStorage.getItem('userSessionId');
        if (!sessionID) {
            toast.warn('You are not authorized');
            return;
        }

        try {
            const { response, error } = await chatUserService.getUser({ sessionID });
            if (response) {
                setUser(response);
            } else {
                toast.error(`Error fetching user: ${error || 'Unknown error'}`);
            }
        } catch (err) {
            toast.error('Failed to fetch user. Please try again later.');
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};