import axios from "axios";

const baseURL = "https://nustlers-backend-abc7tcqox-nicholasohjj.vercel.app";

export const getMarkers = async () => {
    try {
    const response = await axios.get(`${baseURL}/markers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching markers:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
};

