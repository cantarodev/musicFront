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
