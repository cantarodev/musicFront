import axios from 'axios';

export const getReportStatus = async (user_id) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/v1/report/status/${user_id}`);
    const result = JSON.parse(data.result);
    return result;
  } catch (error) {
    console.log(error);
    const { response } = error;
    return response.data;
  }
};
