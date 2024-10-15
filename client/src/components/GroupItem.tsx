import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { chatGroupService } from '../services/chatGroup/index.service';
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const isUserInGroup = group.members.some(member => member._id === currentUserId);

    const handleJoinGroup = async () => {
        try {
            const { response, error } = await chatGroupService.addMember({
                groupId: group._id,
                userId: currentUserId
            });

            if (response) {
                toast.success('The user has been successfully added to the group!');
            }
            if (error) {
                toast.error("The user has not been added to the group!");
            }
        } catch (error) {
            console.log(error);
        }

        console.log(`Приєднуємося до групи: ${group.name}`);
    };

    const handleGroupSelect = () => {
        onSelectGroup(group._id);

    };

    return (
        <div className="border p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-semibold cursor-pointer" onClick={handleGroupSelect}>{group.name}</h3>
            <p className="text-gray-600">Кількість користувачів: {group.members.length}</p>
            <div>
                <button onClick={toggleDropdown} className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
                    {isDropdownOpen ? 'Сховати користувачів' : 'Показати користувачів'}
                </button>
                {isDropdownOpen && (
                    <ul className="mt-2 border rounded-md bg-white">
                        {group.members.map(member => (
                            <li key={member._id} className="p-2 border-b last:border-b-0">
                                {member.username}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {!isUserInGroup && (
                <button
                    onClick={handleJoinGroup}
                    className="mt-4 flex items-center bg-green-500 text-white py-1 px-4 rounded"
                >
                    <FaUserPlus className="mr-2" />
                    Приєднатися до чату
                </button>
            )}
        </div>
    );
};

export default GroupItem;