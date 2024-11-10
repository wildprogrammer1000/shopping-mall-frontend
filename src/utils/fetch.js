import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
console.log("SERVER_URL: " + SERVER_URL);
export const requestFetch = async (path, requestOptions = {}) => {
  try {
    const response = await axios({
      method: requestOptions.method || "GET",
      url: SERVER_URL + path,
      ...requestOptions,
    });
    if (!response.status === 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
