import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/canteens";

export const getCanteens = async () => {
    try {
    const response = await axios.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching canteens:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
};
