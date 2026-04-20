const API_KEY = "c53244e9b94e417286f485df80b096ac";

export const getLatLng = async (location) => {
  try {
    console.log("Fetching geolocation for:", location);

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${API_KEY}&language=en`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geolocation data");
    }

    const data = await response.json();
    console.log("Geolocation API response:", data);

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lng };
    }

    console.error("No results found for this location.");
    return null;

  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    return null;
  }
};