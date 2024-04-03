import axios from 'axios';

export const getBots = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/v1/bot`);
    const bots = JSON.parse(data.bots);
    return bots;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const createBot = async (name, description) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/bot/', {
      name,
      description,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const deleteBot = async (botId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/v1/bot/${botId}`);
    const bot = response?.data;
    return bot;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const updateBot = async (id, name, description) => {
  try {
    const { data } = await axios.put('http://localhost:5000/api/v1/bot/', {
      id,
      name,
      description,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};
