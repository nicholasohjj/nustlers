import axios from "axios";

const baseURL = "https://hacknroll-backend.vercel.app/markers";

// Cache setup
let cache = {
  data: null,
  lastFetch: 0
};

export const getMarkers = async () => {
  // Check if data is already cached
  if (cache.data) {
    return cache.data;
  }

  try {
    const response = await axios.get(baseURL);

    // Update cache
    cache = {
      data: response.data,
      lastFetch: Date.now()
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching markers:", error);
    return null; // or handle the error as you prefer
  }
};
