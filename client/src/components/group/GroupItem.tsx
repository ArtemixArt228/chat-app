import React, { useState, useCallback } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { chatGroupService } from '../../services/chatGroup/index.service';
import { toast } from 'react-toastify';

interface GroupItemProps {
    group: {
        _id: string;
        name: string;
        members: Array<{
            _id: string;
            username: string;
        }>;
    };
    currentUserId: string;
    onSelectGroup: (groupId: string) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, currentUserId, onSelectGroup }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen((prev) => !prev);
    }, []);

    const isUserInGroup = group.members.some(member => member._id === currentUserId);

    const handleJoinGroup = useCallback(async () => {
        try {
            const { response } = await chatGroupService.addMember({
                groupId: group._id,
                userId: currentUserId,
            });

            if (response) {
                toast.success('You have been successfully added to the group!');
            } else {
                toast.error('Failed to add the user to the group.');
            }
        } catch (error) {
            toast.error('Failed to add the user to the group.');
        }
    }, [group._id, currentUserId]);

    const handleGroupSelect = useCallback(() => {
        onSelectGroup(group._id);
    }, [group._id, onSelectGroup]);

    return (
        <div className="border border-gray-300 p-6 rounded-lg shadow-md mb-6 bg-white hover:shadow-lg transition-shadow duration-200">
            <h3
                className="text-2xl font-semibold cursor-pointer text-dark hover:text-primary transition duration-200"
                onClick={handleGroupSelect}
            >
                {group.name}
            </h3>
            <p className="text-gray-600 mt-1">Members: {group.members.length}</p>
            <div className="mt-4">
                <button
                    onClick={toggleDropdown}
                    className="mt-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300"
                >
                    {isDropdownOpen ? 'Hide Users' : 'Show Users'}
                </button>
                {isDropdownOpen && (
                    <ul className="mt-2 border border-gray-300 rounded-md bg-light shadow-md">
                        {group.members.map((member) => (
                            <li
                                key={member._id}
                                className="p-3 border-b last:border-b-0 hover:bg-gray-100 transition duration-200"
                            >
                                {member.username}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {!isUserInGroup && (
                <button
                    onClick={handleJoinGroup}
                    className="mt-4 flex items-center bg-success text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    <FaUserPlus className="mr-2" />
                    Join Chat
                </button>
            )}
        </div>
    );
};

export default GroupItem;
