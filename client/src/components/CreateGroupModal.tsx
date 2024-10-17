import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { chatGroupService } from '../services/chatGroup/index.service';

interface CreateGroupModalProps {
    onClose: () => void;
    userId: string;
}

interface FormData {
    groupName: string;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, userId }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const handleCreateGroup = async (data: FormData) => {
        try {
            const { response, error } = await chatGroupService.createGroup({
                groupName: data.groupName,
                members: [userId],
                createdBy: userId,
            });

            if (response) {
                toast.success('Group created successfully');
                reset(); // Clear form fields after successful creation
                onClose(); // Close the modal
            } else if (error) {
                toast.error('The group was not formed!');
            }
        } catch {
            toast.error('Failed to create the group!');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {userId && (
                <form
                    className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full"
                    onSubmit={handleSubmit(handleCreateGroup)}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-dark">Create a New Group</h2>

                    <input
                        type="text"
                        {...register('groupName', { required: 'Group name is required' })}
                        placeholder="Group Name"
                        className={`border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.groupName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.groupName && (
                        <span className="text-red-500 mb-2">{errors.groupName.message}</span>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300"
                        >
                            Create
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CreateGroupModal;
