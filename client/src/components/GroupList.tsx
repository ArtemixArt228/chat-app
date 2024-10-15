// GroupList.tsx
import React, { useEffect, useState } from 'react';
import { chatGroupService } from '../services/chatGroup/index.service';
import GroupItem from './GroupItem';

type Props = {
    userId: string;
    onSelectGroup: (groupId: string) => void;
};

const GroupList: React.FC<Props> = ({ userId, onSelectGroup }) => {
    const [groups, setGroups] = useState<any>([]);

    useEffect(() => {
        const getAllGroups = async () => {
            try {
                const { response, error } = await chatGroupService.getGroups();

                if (response) {
                    setGroups(response);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getAllGroups();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Список груп</h2>
            {groups.map((group: any) => (
                <GroupItem key={group._id} group={group} currentUserId={userId} onSelectGroup={onSelectGroup} />
            ))}
        </div>
    );
};

export default GroupList;