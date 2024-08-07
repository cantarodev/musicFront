import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const getBots = () => {
  return handleResponse(apiClient.get('/bot'));
};

export const createBot = async (name, description, identifier_tag, required_clave_sol) => {
  return handleResponse(
    apiClient.post('/bot', {
      name,
      description,
      identifier_tag,
      required_clave_sol,
    })
  );
};

export const deleteBot = async (botId) => {
  return handleResponse(apiClient.delete(`/bot/${botId}`));
};

export const updateBot = async (bot_id, name, description, required_clave_sol) => {
  return handleResponse(
    apiClient.put('/bot', {
      bot_id,
      name,
      description,
      required_clave_sol,
    })
  );
};
