import axios from 'axios';

export const getClaveSolAccounts = async (user_id) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/v1/claveSolAccount/${user_id}`);
    const claveSolAccounts = JSON.parse(data.claveSolAccounts);
    return claveSolAccounts;
  } catch (error) {
    console.log(error);
    const { response } = error;
    return response.data;
  }
};

export const createClaveSolAccount = async (user_id, verified, name, ruc, username, password) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/claveSolAccount/', {
      user_id,
      verified,
      name,
      ruc,
      username,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const validateClaveSolAccount = async (account_id, ruc, username, password, mode) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/claveSolAccount/validate', {
      account_id,
      ruc,
      username,
      password,
      mode,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteClaveSolAccount = async (account_id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/v1/claveSolAccount/${account_id}`
    );
    const claveSol = response?.data;
    return claveSol;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const updateClaveSolAccount = async (
  account_id,
  verified,
  name,
  ruc,
  username,
  password
) => {
  try {
    const { data } = await axios.put('http://localhost:5000/api/v1/claveSolAccount/', {
      account_id,
      verified,
      name,
      ruc,
      username,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const deleteClaveSolAccounts = async (accountIds) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/v1/claveSolAccount/deleteAll/${accountIds}`
    );
    const accounts = response?.data;
    return accounts;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};
