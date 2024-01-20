import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/transactions";
const cache = {};

const isCacheValid = (key, ttl) => {
  const entry = cache[key];
  if (!entry) {
    return false;
  }
  const now = new Date();
  return now.getTime() - entry.timestamp < ttl;
};

export const getTransactions = async () => {
  const cacheKey = 'transactions';
  const ttl = 5 * 60 * 1000; // cache time to live in milliseconds, e.g., 5 minutes

  if (isCacheValid(cacheKey, ttl)) {
    return cache[cacheKey].data; // Return cached data
  }

  try {
    const response = await axios.get(`${baseURL}`);
    cache[cacheKey] = { data: response.data, timestamp: new Date().getTime() };
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
};

export const getTransactionsById = async (userId) => {
  const cacheKey = `transactions-${userId}`;
  const ttl = 5 * 60 * 1000; // cache time to live in milliseconds

  if (isCacheValid(cacheKey, ttl)) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(`${baseURL}/${userId}`);
    cache[cacheKey] = { data: response.data, timestamp: new Date().getTime() };
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions by user id:", error);
    return null;
  }
};

export const getTransactionsByStallId = async (stallId) => {
  const cacheKey = `transactions-${stallId}`;
  const ttl = 5 * 60 * 1000; // cache time to live in milliseconds

  if (isCacheValid(cacheKey, ttl)) {
    return cache[cacheKey].data;
  }

  try {
    const response = await axios.get(`${baseURL}/stall/${stallId}`);
    cache[cacheKey] = { data: response.data, timestamp: new Date().getTime() };
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions by stall id:", error);
    return null;
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