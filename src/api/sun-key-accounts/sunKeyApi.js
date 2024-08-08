import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const getClaveSolAccounts = (user_id) => {
  return handleResponse(apiClient.get(`/claveSolAccount/${user_id}`));
};

export const createClaveSolAccount = (user_id, verified, name, ruc, username, password) => {
  return handleResponse(
    apiClient.post('/claveSolAccount/', {
      user_id,
      verified,
      name,
      ruc,
      username,
      password,
    })
  );
};

export const validateClaveSolAccount = (user_id, account_id, ruc, username, password, mode) => {
  return handleResponse(
    apiClient.post('/claveSolAccount/validate', {
      user_id,
      account_id,
      ruc,
      username,
      password,
      mode,
    })
  );
};

export const deleteClaveSolAccount = (account_id) => {
  return handleResponse(apiClient.delete(`/claveSolAccount/${account_id}`));
};

export const updateClaveSolAccount = (
  user_id,
  account_id,
  verified,
  name,
  ruc,
  username,
  password
) => {
  return handleResponse(
    apiClient.put('/claveSolAccount/', {
      user_id,
      account_id,
      verified,
      name,
      ruc,
      username,
      password,
    })
  );
};

export const deleteClaveSolAccounts = (accountIds) => {
  return handleResponse(apiClient.delete(`/claveSolAccount/deleteAll/${accountIds}`));
};
