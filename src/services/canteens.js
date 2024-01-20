import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/canteens";

// Caching for getCanteenById
const canteenCache = {};

export const getCanteens = async () => {
    try {
        const response = await axios.get(`${baseURL}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching canteens:", error);
        return null; // or however you wish to handle this
    }
};

export const getCanteenById = async (id) => {
    // Check if the canteen data is already in the cache
    if (canteenCache[id]) {
        return canteenCache[id];
    }

    try {
        const response = await axios.get(`${baseURL}/${id}`);
        
        // Cache the response data
        canteenCache[id] = response.data;

        return response.data;
    } catch (error) {
        console.error("Error fetching canteen by id:", error);
        return null; // or however you wish to handle this
    }
};
