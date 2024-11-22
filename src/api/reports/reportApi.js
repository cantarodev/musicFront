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
  return handleResponse(
    apiClient.post('/report/observations/show/', {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
      factoringStatuses,
    })
  );
};

export const getReportDetractions = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account
) => {
  return handleResponse(
    apiClient.post(`/report/observations/detractions`, {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
    })
  );
};

export const getReportDebitCreditNotes = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account
) => {
  return handleResponse(
    apiClient.post(`/report/observations/notes`, {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
    })
  );
};

export const getReportCorrelativity = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account
) => {
  return handleResponse(
    apiClient.post(`/report/observations/correlativity`, {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
    })
  );
};

export const getReportFactoring = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account
) => {
  return handleResponse(
    apiClient.post(`/report/observations/factoring`, {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
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

export const downloadObservations = (filteredData) => {
  return handleResponse(apiClient.post('/report/observations/download', { filteredData }));
};

export const downloadObservationsExcel = (params, filteredData, filePath) => {
  return handleResponse(
    apiClient.post('/report/observations/download-excel', { params, filteredData, filePath })
  );
};

export const downloadMissingsExcel = (filteredData, filePath) => {
  return handleResponse(
    apiClient.post('/report/missings/download-excel', { filteredData, filePath })
  );
};
