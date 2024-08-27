export const handleResponse = async (promise) => {
  try {
    const response = await promise;
    return response.data || response;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response.data.message || error.message);
  }
};
