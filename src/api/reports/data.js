import apiClient from '../apiClient';

export const getReportStatus = async (user_id) => {
  try {
<<<<<<< HEAD
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/report/status/${user_id}`
    );
=======
    const { data } = await apiClient.get(`/report/status/${user_id}`);
>>>>>>> 70e2cb2b99af591be540696f51fd67e48816584a
    const result = JSON.parse(data.result);
    return result;
  } catch (error) {
    console.log(error);
    const { response } = error;
    return response.data;
  }
};

export const getReportDetails = async (user_id, period, type, page, pageSize) => {
  try {
<<<<<<< HEAD
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/report/details/${user_id}/${period}/${type}?page=${page}&pageSize=${pageSize}`
=======
    const { data } = await apiClient.get(
      `/report/details/${user_id}/${period}/${type}?page=${page}&pageSize=${pageSize}`
>>>>>>> 70e2cb2b99af591be540696f51fd67e48816584a
    );
    const { items, total, generalDetail } = data;
    return { items, total, generalDetail };
  } catch (error) {
    console.log(error);
    return { items: [], total: 0 };
  }
};
