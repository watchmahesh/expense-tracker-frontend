import { API_ROUTES } from "../apiRoutes";
import axiosInstance from "../axiosInstance";

export const postItemData = async (data: any) => {  // Exporting the function directly
    try {
        console.log(data)
        const response = await axiosInstance.post(
            API_ROUTES.expenseItem,
            data, // Pass the data directly in the request body
            { headers: { 'Content-Type': 'application/json' } } // Optional if already set in axiosInstance
        );
        return response.data; // Return only the data from the response
    } catch (error) {
        console.error('Error posting data:', error);
        throw error; // Throw the error to be handled by the caller
    }
};

export const getItemData = async (page: number, limit = 8) => {
    try {
        const response = await axiosInstance.get(
            `${API_ROUTES.expenseItem}?pageNumber=${page}&limit=${limit}`,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // Return only the data from the response
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Throw the error to be handled by the caller
    }
};

export const updateItem = async (id: string, payload: any) => {
    try {
        const response = await axiosInstance.put(
            `${API_ROUTES.expenseItem}/${id}`,
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // Return only the data from the response
    } catch (error) {
        console.error('Error updating item:', error);
        throw error; // Throw the error to be handled by the caller
    }
};


export const getItemById = async (id: string) => {
    try {
        const response = await axiosInstance.get(
            `${API_ROUTES.expenseItem}/${id}`,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // Return only the data from the response
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        throw error; // Throw the error to be handled by the caller
    }
};

export const deleteItem = async (id: number) => {
    try {
        const response = await axiosInstance.delete(
            `${API_ROUTES.expenseItem}/${id}`,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // Return only the data from the response
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error; // Throw the error to be handled by the caller
    }
};

export const getItemByType = async (type: string) => {
    try {
        const response = await axiosInstance.get(
            `${API_ROUTES.expenseType}/type?type=${type}`,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // Return only the data from the response
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        throw error; // Throw the error to be handled by the caller
    }
};
