import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const getReportStatus = (user_id) => {
  return handleResponse(apiClient.get(`/report/status/${user_id}`));
};

export const getReportDetails = (user_id, period, type, page, pageSize) => {
  return handleResponse(
    apiClient.get(`/report/details/${user_id}/${period}/${type}?page=${page}&pageSize=${pageSize}`)
  );
};
