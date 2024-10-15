import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { chatGroupService } from '../services/chatGroup/index.service';

interface CreateGroupModalProps {
    onClose: () => void;
    userId: string
}

interface FormData {
    groupName: string;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, userId }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const handleCreateGroup = async (data: FormData) => {
        console.log('Creating group:', data.groupName);

        try {
            const { response, error } = await chatGroupService.createGroup({
                groupName: data.groupName,
                members: [userId],
                createdBy: userId
            })

            if (response) {
                toast.success('Group created successfully')
            }
            if (error) {
                toast.error('The qroup was not formed!')
            }
            onClose();
        } catch (error) {
            console.log(error)
        }


    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {userId &&
                <form
                    className="bg-white p-8 rounded-lg shadow-lg"
                    onSubmit={handleSubmit(handleCreateGroup)}
                >
                    <h2 className="text-lg font-semibold mb-4">Створити нову групу</h2>

                    <input
                        type="text"
                        {...register('groupName', { required: 'Назва групи є обов\'язковою' })}
                        placeholder="Назва групи"
                        className={`border p-2 w-full mb-4 ${errors.groupName ? 'border-red-500' : ''}`}
                    />
                    {errors.groupName && <span className="text-red-500 mb-2">{errors.groupName.message}</span>}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 text-white py-2 px-4 rounded"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Створити
                        </button>
                    </div>
                </form>}
        </div>
    );
};

export default CreateGroupModal;