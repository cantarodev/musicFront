import apiClient from '../apiClient';

export const items = [];
export const getFiles = async (user_id) => {
  try {
<<<<<<< HEAD
    const { data } = await axios.get(`http://localhost:5000/api/v1/file/${user_id}`);
=======
    const { data } = await apiClient.get(`/file/${user_id}`);
>>>>>>> 70e2cb2b99af591be540696f51fd67e48816584a
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
<<<<<<< HEAD
    const { data } = await axios.get(`http://localhost:5000/api/v1/file/totals/${user_id}`);
=======
    const { data } = await apiClient.get(`/file/totals/${user_id}`);
>>>>>>> 70e2cb2b99af591be540696f51fd67e48816584a
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
<<<<<<< HEAD
    const { data } = await axios.post('http://localhost:5000/api/v1/file/upload', formData, {
=======
    const { data } = await apiClient.post('/file/upload', formData, {
>>>>>>> 70e2cb2b99af591be540696f51fd67e48816584a
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
<<<<<<< HEAD
    const response = await axios.delete(`http://localhost:5000/api/v1/file/${user_id}/${file_id}`);
=======
    const response = await apiClient.delete(`/file/${user_id}/${file_id}`);
>>>>>>> 70e2cb2b99af591be540696f51fd67e48816584a
    const file = response?.data;
    return file;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const downloadFile = async (user_id, file_id) => {
  try {
<<<<<<< HEAD
    const response = await axios.get(
      `http://localhost:5000/api/v1/file/download/${user_id}/${file_id}`
    );
=======
    const response = await apiClient.get(`/file/download/${user_id}/${file_id}`);
>>>>>>> 70e2cb2b99af591be540696f51fd67e48816584a
    const file = response?.data;
    return file;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};
