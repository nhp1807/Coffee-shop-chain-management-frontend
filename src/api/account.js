import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/account";

export const createAccount = async (account) => {
    return await axios.post(`${API_BASE_URL}/create`, account);
};

export const getAllAccounts = async () => {
    const result = await axios.get(`${API_BASE_URL}/get/all`);
    return result.data.data;
};

export const getAccountById = async (id) => {
    return await axios.get(`${API_BASE_URL}/get/${id}`);
};

export const deleteAccountById = async (id) => {
    await axios.delete(`${API_BASE_URL}/delete/${id}`);
};