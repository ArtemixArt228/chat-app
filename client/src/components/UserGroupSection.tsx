import React, { useEffect, useState } from 'react';
import { chatUserService } from "../services/chatUser/index.service";
import CreateGroupModal from './CreateGroupModal'; 
import GroupList from './GroupList';

interface UserGroupSectionProps {
    onGroupSelect: (groupId: string) => void; 
    user: any
}

const UserGroupSection: React.FC<UserGroupSectionProps> = ({ onGroupSelect, user }) => {

    const [isModalCreateNewGroupOpen, setIsModalCreateNewGroupOpen] = useState(false);


    const handleOpenModal = () => {
        setIsModalCreateNewGroupOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalCreateNewGroupOpen(false);
    };

    return (
        <div className='max-h-screen overflow-auto sticky top-0'>
            <div>
                <h2>{user?.username}</h2>
            </div>
            <button onClick={handleOpenModal} className="bg-blue-500 text-white py-2 px-4 rounded">
                Створити нову групу
            </button>
            <GroupList userId={user?._id} onSelectGroup={onGroupSelect} /> 
            {isModalCreateNewGroupOpen && (
                <CreateGroupModal onClose={handleCloseModal} userId={user?._id} />
            )}
        </div>
    );
};

export default UserGroupSection;
