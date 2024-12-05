import axios from "axios";

const BASE_URL = "http://localhost:8080/api/account";

export const getAllAccounts = async () => {
    const response = await axios.get(`${BASE_URL}/get/all`);
    return response.data.data;
};

export const deleteAccountById = async (id) => {
    await axios.delete(`${BASE_URL}/delete/${id}`);
};

export const updateAccount = async (accountID, accountData) => {
    await axios.put(`${BASE_URL}/update/${accountID}`, accountData);
};

export const createAccount = async (accountData) => {
    await axios.post(`${BASE_URL}/create`, accountData);
};
