import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const getListPeriods = (ruc) => {
  return handleResponse(apiClient.get(`/business-info/${ruc}`));
};
