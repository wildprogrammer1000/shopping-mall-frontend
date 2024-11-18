import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
console.log("SERVER_URL: " + SERVER_URL);

export const requestFetch = async (path, requestOptions = {}) => {
  try {
    const response = await axios({
      method: requestOptions.method || "GET",
      url: SERVER_URL + path,
      withCredentials: true,  // 각 요청마다 credentials 설정
      ...requestOptions,
      // data : Request Body(json)
      // params: Query String(json)
    });
    if (!response.status === 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
