import axios from "axios";

const baseURL = "http://localhost:3001";

export const getMarkers = async () => {
    try {
    const response = await axios.get(`${baseURL}/query`);
    return response.data;
  } catch (error) {
    console.error("Error fetching markers:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
};