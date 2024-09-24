import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemType } from '../../../../constant/ItemType';
import { TOAST_CONFIG } from '../../../../constant/custom';
import { postItemData, getItemById, updateItem } from '../../../../api/expenseItem/item';
import { toast } from 'react-toastify';

interface AddItemProps {
    onSave: () => void;
    isEdit?: boolean;
}

const AddItem: React.FC<AddItemProps> = ({ onSave, isEdit = false }) => {
    const [name, setName] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [isOptionSelected, setIsOptionSelected] = useState(false);
    const [nameError, setNameError] = useState('');
    const [typeError, setTypeError] = useState('');
    const { id } = useParams<{ id: string }>(); // Get item ID from URL params
    const navigate = useNavigate();
    const [initialName, setInitialName] = useState('');
    const [initialOption, setInitialOption] = useState('');

    useEffect(() => {
        if (id) {
            // Fetch the item data if in edit mode
            const fetchItemData = async () => {
                try {
                    const response = await getItemById(id);
                    setName(response.data.name);
                    setSelectedOption(response.data.type);
                    setIsOptionSelected(true);
                    setInitialName(response.data.name);
                    setInitialOption(response.data.type);
                } catch (error) {
                    toast.error('Failed to load item data', TOAST_CONFIG);
                }
            };
            fetchItemData();
        }
    }, [isEdit, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setNameError('');
        setTypeError('');

        // Validate input fields
        if (!name) {
            setNameError('Item name is required');
        }
        if (!selectedOption) {
            setTypeError('Item type is required');
        }

        if (!name || !selectedOption) {
            return;
        }

        const payload = { name, type: selectedOption };

        try {
            let response;
            if (isEdit && id) {
                // Update existing item
                response = await updateItem(id, payload);
            } else {
                // Add new item
                response = await postItemData(payload);
            }

            if (response.status === 'success') {
                toast.success(id ? 'Item updated successfully!' : 'Item added successfully!', TOAST_CONFIG);
                onSave();
            } else {
                toast.error(`Failed to ${id ? 'update' : 'add'} item: ${response.message || 'Unknown error'}`, TOAST_CONFIG);
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message || 'Something went wrong'}`, TOAST_CONFIG);
        }
    };

    const handleCancel = () => {
        navigate('/expense/expense-items');
    };

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };
    const hasChanges = name !== initialName || selectedOption !== initialOption;


    return (
        <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Item Name <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter the item name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {nameError && (
                                    <p className="mt-2 text-red-500 text-sm">{nameError}</p>
                                )}
                            </div>


                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Item Type
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={selectedOption}
                                        onChange={(e) => {
                                            setSelectedOption(e.target.value);
                                            changeTextColor();
                                        }}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? 'text-black dark:text-white' : ''
                                            }`}
                                    >
                                        <option value="" disabled className="text-body dark:text-bodydark">
                                            Select your Item Type
                                        </option>
                                        {ItemType.map((option) => (
                                            <option key={option.value} value={option.value} className="text-body dark:text-bodydark">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>

                                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                        <svg
                                            className="fill-current"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.8">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                    fill=""
                                                ></path>
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                                {typeError && (
                                    <p className="mt-2 text-red-500 text-sm">{typeError}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded-md text-white ${hasChanges
                                            ? 'bg-primary hover:bg-primary-dark shadow-md'
                                            : 'bg-primary cursor-not-allowed shadow-none'
                                        }`}
                                    disabled={!hasChanges}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItem;
