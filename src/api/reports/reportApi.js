import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const getReportObservations = (user_id, period, queryType, docType, currency) => {
  return handleResponse(
    apiClient.get(
      `/report/observations/show/${user_id}/${period}/${queryType}/${docType}/${currency}`
    )
  );
};

export const getReportMissings = (user_id, period, queryType, docType, currency) => {
  return handleResponse(
    apiClient.get(`/report/missings/${user_id}/${period}/${queryType}/${docType}/${currency}`)
  );
};

export const downloadObservations = (path) => {
  return handleResponse(apiClient.post(`/report/observations/download`, { path }));
};
