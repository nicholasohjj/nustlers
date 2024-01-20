import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/markers";

// Cache setup
let cache = {
  data: null,
  lastFetch: 0
};
const cacheDuration = 5 * 60 * 1000; // Cache duration in milliseconds, e.g., 5 minutes

export const getMarkers = async () => {
  const now = new Date().getTime();

  // Check if cache is valid
  if (cache.data && (now - cache.lastFetch < cacheDuration)) {
    return cache.data; // Return cached data
  }

  try {
    const response = await axios.get(baseURL);

    // Update cache
    cache = {
      data: response.data,
      lastFetch: now
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching markers:", error);
    // Handle the error appropriately
    return null; // or however you wish to handle this
  }
};
