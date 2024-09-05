import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const reportObservations = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account,
  factoringStatuses
) => {
  console.log(account);

  return handleResponse(
    apiClient.post('/report/observations/show/', {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
      factoringStatuses
    })
  );
};

export const getReportMissings = (user_id, period, queryType, docType, currency, account) => {
  return handleResponse(
    apiClient.get(
      `/report/missings/${user_id}/${period}/${queryType}/${docType}/${currency}/${account}`
    )
  );
};

export const downloadObservations = (path) => {
  return handleResponse(apiClient.post('/report/observations/download', { path }));
};
