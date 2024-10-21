const SERVER_URL = import.meta.env.VITE_SERVER_URL;
console.log("SERVER_URL: " + SERVER_URL);
export const requestFetch = async (path, requestOptions) => {
  try {
    const defaultRequestOptions = {
      method: requestOptions.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: requestOptions.body ? JSON.stringify(requestOptions.body) : null,
    };
    const response = await fetch(SERVER_URL + path, {
      ...defaultRequestOptions,
      ...requestOptions,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
