import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/transactions";

export const getTransactions = async () => {
    try {
    const response = await axios.get(`${baseURL}/transactions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
};

export const addTransaction = async (formData) => {
    try {
        const response = await axios.post(`${baseURL}/transactions`, formData);
        return response.data;
      } catch (error) {
        console.error("Error adding transaction:", error);
        // Handle the error appropriately
        return null; // or however you wish to handle this
      }
    };

export const updateTransaction = async (transactionId) => {
    try {
        const response = await axios.put(`${baseURL}/transactions/${transactionId}`);
        return response.data;
      } catch (error) {
        console.error("Error updating transaction:", error);
        // Handle the error appropriately
        return null; // or however you wish to handle this
      }
    };

export const deleteTransaction = async (transactionId) => {
    try {
        const response = await axios.delete(`${baseURL}/transactions/${transactionId}`);
        return response.data;
      } catch (error) {
        console.error("Error deleting transaction:", error);
        // Handle the error appropriately
        return null; // or however you wish to handle this
      }
    };