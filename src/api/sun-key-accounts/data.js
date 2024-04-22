import axios from 'axios';

export const getSunKeyAccounts = async (userId) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/v1/sunKeyAccount/${userId}`);
    const sunKeyAccounts = JSON.parse(data.sunKeyAccounts);
    return sunKeyAccounts;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const createSunKeyAccount = async (userId, ruc, username, password) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/sunKeyAccount/', {
      userId,
      ruc,
      username,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const deleteSunKeyAccount = async (sunKeyId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/v1/sunKeyAccount/${sunKeyId}`);
    const sunKey = response?.data;
    return sunKey;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const updateSunKeyAccount = async (id, ruc, username, password) => {
  try {
    const { data } = await axios.put('http://localhost:5000/api/v1/sunKeyAccount/', {
      id,
      ruc,
      username,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};
