import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/markers";

export const getMarkers = async () => {
    try {
    const response = await axios.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching markers:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
};

