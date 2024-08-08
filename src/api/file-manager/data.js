import axios from 'axios';

export const items = [];
export const getFiles = async (user_id) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/v1/file/${user_id}`);
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
    const { data } = await axios.get(`http://localhost:5000/api/v1/file/totals/${user_id}`);
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
    const { data } = await axios.post('http://localhost:5000/api/v1/file/upload', formData, {
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
    const response = await axios.delete(`http://localhost:5000/api/v1/file/${user_id}/${file_id}`);
    const file = response?.data;
    return file;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const downloadFile = async (user_id, file_id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/file/download/${user_id}/${file_id}`
    );
    const file = response?.data;
    return file;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};
