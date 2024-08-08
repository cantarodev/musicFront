import apiClient from '../apiClient';

export const getReportStatus = async (user_id) => {
  try {
    const { data } = await apiClient.get(`/report/status/${user_id}`);
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
    const { data } = await apiClient.get(
      `/report/details/${user_id}/${period}/${type}?page=${page}&pageSize=${pageSize}`
    );
    const { items, total, generalDetail } = data;
    return { items, total, generalDetail };
  } catch (error) {
    console.log(error);
    return { items: [], total: 0 };
  }
};
