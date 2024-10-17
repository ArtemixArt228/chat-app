import React, { useState } from 'react';

import CreateGroupModal from '../CreateGroupModal';
import GroupList from './GroupList';
import { useUserContext } from '../../context/UserContext';

interface User {
  _id: string;
  username: string;
}

interface UserGroupSectionProps {
  onGroupSelect: (groupId: string) => void;
}

const UserGroupSection: React.FC<UserGroupSectionProps> = ({
  onGroupSelect,
}) => {
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const { user } = useUserContext();

  const handleOpenModal = () => setCreateGroupModalOpen(true);
  const handleCloseModal = () => setCreateGroupModalOpen(false);

  return (
    <div className="max-h-screen overflow-auto p-6 bg-light shadow-md rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-dark">{user?.username}</h2>
      </div>
      <button
        onClick={handleOpenModal}
        className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300 mb-4"
      >
        Create New Group
      </button>
      {user && <GroupList userId={user._id} onSelectGroup={onGroupSelect} />}
      {isCreateGroupModalOpen && user?._id && (
        <CreateGroupModal onClose={handleCloseModal} userId={user._id} />
      )}
    </div>
  );
};

export default UserGroupSection;
