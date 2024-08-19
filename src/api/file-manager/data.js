import { User } from '@auth0/auth0-spa-js';
import apiClient from '../apiClient';

export const items = [];
export const getFiles = async (user_id) => {
  try {
    const { data } = await apiClient.get(`/file/${user_id}`);
    const files = JSON.parse(data.files);
    return files;
  } catch (error) {
    console.log(error);
    const { response } = error;
    return response.data;
  }
};

export const getTotals = async (user_id) => {
  try {
    const { data } = await apiClient.get(`/file/totals/${user_id}`);
    const totals = JSON.parse(data.totals);
    return totals;
  } catch (error) {
    console.log(error);
    const { response } = error;
    return response.data;
  }
};

export const createFile = async (formData) => {
  try {
    console.log(formData);
    const { data } = await apiClient.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const deleteFile = async (user_id, file_id) => {
  try {
    const response = await apiClient.delete(`/file/${user_id}/${file_id}`);
    const file = response?.data;
    return file;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const downloadFile = async (user_id, file_id) => {
  try {
    const response = await apiClient.get(`/file/download/${user_id}/${file_id}`);
    const file = response?.data;
    return file;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const searchComprobante = async (user_id, file_id, comprobante) => {
  try {
    const response = await apiClient.get(`/file/search/${user_id}/${file_id}/${comprobante}`);
    console.log("REQUEST PAST DATA: ", user_id, "-",file_id,"-", comprobante);
    const file = response?.data;
    return file;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};
