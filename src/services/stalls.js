import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/stalls";

export const getStalls = async () => {
    try {
    const response = await axios.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stalls:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
};

export const getStallsById = async (ids) => {
  try {
    const response = await axios.get(`${baseURL}/canteen`, ids );
    return response.data;
  } catch (error) {
    console.error("Error fetching stalls by stall id:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
}

