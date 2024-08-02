import axios from 'axios';

export const getReportStatus = async (user_id) => {
  try {
    const { data } = await axios.get(`https://server-izitax.analytia.pe/api/v1/report/status/${user_id}`);
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
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/report/details/${user_id}/${period}/${type}?page=${page}&pageSize=${pageSize}`
    );
    const { items, total } = data;
    return { items, total };
  } catch (error) {
    console.log(error);
    return { items: [], total: 0 };
  }
};
