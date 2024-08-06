import axios from 'axios';
import { handleApiError } from '../apiHelpers';

const BASE_URL = 'https://server-izitax.analytia.pe/api/v1/bot';

export const getBots = async () => {
  try {
    const { data } = await axios.get(BASE_URL);
    return JSON.parse(data.bots);
  } catch (error) {
    return handleApiError(error);
  }
};

export const createBot = async (name, description, identifier_tag, required_clave_sol) => {
  try {
    const { data } = await axios.post(BASE_URL, {
      name,
      description,
      identifier_tag,
      required_clave_sol,
    });
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteBot = async (botId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${botId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateBot = async (bot_id, name, description, required_clave_sol) => {
  try {
    const { data } = await axios.put(BASE_URL, { bot_id, name, description, required_clave_sol });
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};
