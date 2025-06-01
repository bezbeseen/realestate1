// freepik.js

const FreepikAPI = (() => {
    const API_KEY = "FPSXa4f54291a1c68d77624fc2bedb15d2ef"; // Replace with your Freepik API token
    const BASE_URL = "https://api.freepik.com/v1/resources/search";
   
    /**
     * Searches Freepik for a given query and returns the top result URL.
     * @param {string} query - Search term.
     * @param {string} type - Type of asset (e.g. "vector", "photo", "psd").
     * @param {number} limit - Number of results to fetch.
     * @returns {Promise<string|null>} - URL of the top result's preview image.
     */
    async function search(query, type = "vector", limit = 1) {
      const url = `${BASE_URL}?lang=en&limit=${limit}&page=1&term=${encodeURIComponent(query)}&type=${type}`;
  
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        });
  
        if (!response.ok) {
          console.warn(`Freepik API error: ${response.statusText}`);
          return null;
        }
  
        const data = await response.json();
        return data?.data?.[0]?.assets?.preview?.url || null;
  
      } catch (error) {
        console.error("Freepik API fetch failed:", error);
        return null;
      }
    }
  
    return { search };
  })();
  