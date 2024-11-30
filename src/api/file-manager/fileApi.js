import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const getFiles = async (user_id, rucAccount, option, year, type) => {
  return handleResponse(apiClient.get(`/file/${user_id}/${rucAccount}/${option}/${year}/${type}`));
};

export const getTotals = async (user_id, rucAccount, option) => {
  return handleResponse(apiClient.get(`/file/totals/${user_id}/${rucAccount}/${option}`));
};

export const createFile = async (formData) => {
  return handleResponse(
    apiClient.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );
};

export const deleteFile = async (user_id, file_id, option) => {
  return handleResponse(apiClient.delete(`/file/${option}/${user_id}/${file_id}`));
};

export const downloadFile = async (user_id, file_id, option) => {
  return handleResponse(apiClient.get(`/file/download/${option}/${user_id}/${file_id}`));
};

export const searchComprobante = async (user_id, file_id, comprobante) => {
  console.log('.............:  ', user_id, file_id, comprobante);
  return handleResponse(apiClient.get(`/file/search/${user_id}/${file_id}/${comprobante}`));
};
