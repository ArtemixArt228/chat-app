import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

import GroupItem from './GroupItem';

import { chatGroupService } from '../../services/chatGroup/index.service';

import {IChatGroup} from "../../interfaces/chat.interfaces";


interface IGroupListProps {
    userId: string;
    onSelectGroup: (groupId: string) => void;
};

const GroupList: React.FC<IGroupListProps> = ({ userId, onSelectGroup }) => {
    const [groups, setGroups] = useState<IChatGroup[]>([]);

    const fetchGroups = useCallback(async () => {
        try {
            const { response, error } = await chatGroupService.getGroups();

            if (response) {
                setGroups(response);
            } else if (error) {
                toast.error("Couldn't fetch groups: " + error);
            }
        } catch (error) {
            toast.error("An error occurred while fetching groups.");
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Список груп</h2>
            {groups.length > 0 ? (
                groups.map((group) => (
                    <GroupItem
                        key={group._id}
                        group={group}
                        currentUserId={userId}
                        onSelectGroup={onSelectGroup}
                    />
                ))
            ) : (
                <p>No groups available.</p>
            )}
        </div>
    );
};

export default GroupList;
