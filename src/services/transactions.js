import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/transactions";

export const getTransactions = async () => {
    try {
    const response = await axios.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
};

export const getTransactionsById = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions by user id:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
}

export const addTransaction = async (formData) => {
  try {
      const response = await axios.post(`${baseURL}`, formData);
      return response.data;
  } catch (error) {
      console.error("Error adding transaction:", error);

      // Check if the error response is from your server and has a specific message
      if (error.response && error.response.data && error.response.data.error) {
          // Return the specific error message from your server
          return { error: error.response.data.error };
      } else {
          // Handle other kinds of errors (e.g., network issues)
          return { error: "An unexpected error occurred. Please try again." };
      }
  }
};


export const updateTransaction = async (updatedTransaction) => {
    try {
        console.log("IM TRYING SO HARD")
        console.log(updatedTransaction)
        console.log(baseURL)
        const response = await axios.put(`${baseURL}/`);
        return response.data;
      } catch (error) {
        console.error("Error updating transaction:", error);
        // Handle the error appropriately
        return null; // or however you wish to handle this
      }
    };

export const deleteTransaction = async (transactionId) => {
    try {
        const response = await axios.delete(`${baseURL}/${transactionId}`);
        return response.data;
      } catch (error) {
        console.error("Error deleting transaction:", error);
        // Handle the error appropriately
        return null; // or however you wish to handle this
      }
    };