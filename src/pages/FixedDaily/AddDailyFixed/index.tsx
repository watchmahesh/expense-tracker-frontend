import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {  getItemByType } from '../../../api/expenseItem/item';
import { TOAST_CONFIG } from '../../../constant/custom';
import flatpickr from 'flatpickr';
import { getDataById, postData, updateData } from '../../../api/fixedDaily/fixedDaily';
import { format } from 'date-fns';

interface AddItemProps {
    onSave: () => void;
    isEdit?: boolean;
}

const AddDailyFixed: React.FC<AddItemProps> = ({ onSave, isEdit = false }) => {
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        description: '',
        selectedOption: ''
    });
    const [errors, setErrors] = useState({
        amountError: '',
        dateError: '',
        descriptionError: '',
        typeError: ''
    });
    const [initialData, setInitialData] = useState({
        name: '',
        amount: '',
        date: '',
        description: '',
        selectedOption: ''
    });
    const [items, setItems] = useState<any[]>([]);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id) {
            const fetchItemData = async () => {
                try {
                    const response = await getDataById(id);
                    const data = response.data;
                    const formattedDate = format(new Date(data.date), 'MMM dd, yyyy'); // Format the date

                    setFormData({
                        amount: data.amount,
                        date: formattedDate,
                        description: data.description,
                        selectedOption: data.costItems.name

                    });
                    setInitialData({
                        name: data.name,
                        amount: data.amount,
                        date: data.month,
                        description: data.description,
                        selectedOption: data.costItems.name
                    });
                } catch (error) {
                    console.log(error)
                    toast.error('Failed to load item data');
                }
            };
            fetchItemData();
        }
    }, [id]);

    useEffect(() => {
        const fetchExpenseTypeData = async () => {
            try {
                const response = await getItemByType('FIXED_DAILY');
                setItems(response.data);
            } catch (error) {
                toast.error('Failed to load item types');
            }
        };
        fetchExpenseTypeData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = {
            amountError: formData.amount && Number(formData.amount) > 0 ? '' : 'Valid amount is required',
            dateError: formData.date ? '' : 'Date is required',
            descriptionError: formData.description ? '' : 'Description is required',
            typeError: formData.selectedOption ? '' : 'Item type is required'
        };
        setErrors(validationErrors);

        if (Object.values(validationErrors).some(error => error)) return;

        const payload = {
            amount: Number(formData.amount),
            date: formData.date,
            description: formData.description,
            cost_item_id: Number(formData.selectedOption)
        };

        try {
            const response = isEdit && id ? await updateData(id, payload) : await postData(payload);
            if (response.status === 'success') {
                toast.success(isEdit ? 'Data updated successfully!' : 'Data added successfully!');
                onSave();
            } else {
                toast.error(`Failed to ${isEdit ? 'update' : 'add'} item: ${response.message || 'Unknown error'}`, TOAST_CONFIG);
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message || 'Something went wrong'}`, TOAST_CONFIG);
        }
    };

    const handleCancel = () => navigate('/expense/fixed-daily');

    const hasChanges = Object.keys(formData).some(key => formData[key as keyof typeof formData] !== initialData[key as keyof typeof initialData]);

    useEffect(() => {
        // Init flatpickr with change handler
        if (dateInputRef.current) {
            flatpickr(dateInputRef.current, {
                mode: 'single',
                static: true,
                monthSelectorType: 'static',
                dateFormat: 'M j, Y',
                prevArrow:
                    '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
                nextArrow:
                    '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
                onChange: (_selectedDates, dateStr) => {
                    setFormData(prev => ({ ...prev, date: dateStr }));
                },
            });
        }
    }, []);

    return (
        <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Item Name</label>
                                <select
                                    name="selectedOption"
                                    value={formData.selectedOption}
                                    onChange={handleChange}
                                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${formData.selectedOption ? 'text-black dark:text-white' : ''}`}
                                >
                                    <option value="" disabled className="text-body dark:text-bodydark">Select Expense Item</option>
                                    {items.map(option => (
                                        <option key={option.id} value={option.id} className="text-body dark:text-bodydark">
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.typeError && <p className="mt-2 text-red-500 text-sm">{errors.typeError}</p>}
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Amount</label>
                                <input
                                    name="amount"
                                    type="number"
                                    placeholder="Enter the amount"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                                {errors.amountError && <p className="mt-2 text-red-500 text-sm">{errors.amountError}</p>}
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Date picker</label>
                                <div className="relative">
                                    <input
                                        name="date"
                                        value={formData.date}
                                        ref={dateInputRef}
                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        placeholder="mm/dd/yyyy"
                                        data-class="flatpickr-right"
                                    />
                                    <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.7504 2.9812H13.6688V2.24312C13.6688 1.67688 13.2088 1.2168 12.6425 1.2168C12.0762 1.2168 11.6161 1.67688 11.6161 2.24312V2.9812H6.61714V2.24312C6.61714 1.67688 6.15706 1.2168 5.59082 1.2168C5.02458 1.2168 4.5645 1.67688 4.5645 2.24312V2.9812H2.48286C1.64355 2.9812 0.964233 3.66051 0.964233 4.49982V14.7119C0.964233 15.5512 1.64355 16.2305 2.48286 16.2305H15.7504C16.5897 16.2305 17.269 15.5512 17.269 14.7119V4.49982C17.269 3.66051 16.5897 2.9812 15.7504 2.9812ZM15.4631 14.7119H2.48286V7.47307H15.7504V14.7119H15.4631ZM2.48286 6.23519V4.49982H4.5645V5.23791C4.5645 5.80415 5.02458 6.26423 5.59082 6.26423C6.15706 6.26423 6.61714 5.80415 6.61714 5.23791V4.49982H11.6161V5.23791C11.6161 5.80415 12.0762 6.26423 12.6425 6.26423C13.2088 6.26423 13.6688 5.80415 13.6688 5.23791V4.49982H15.7504V6.23519H2.48286Z" fill="#AEB7C0" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.dateError && <p className="mt-2 text-red-500 text-sm">{errors.dateError}</p>}
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Type your message"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                                {errors.descriptionError && <p className="mt-2 text-red-500 text-sm">{errors.descriptionError}</p>}
                            </div>

                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-gray dark:text-white"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!hasChanges}
                                    type="submit"
                                    className={`flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray dark:text-white ${hasChanges ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
                                >
                                    {isEdit ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDailyFixed;
