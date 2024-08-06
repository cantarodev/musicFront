import axios from 'axios';

export const getClaveSolAccounts = async (user_id) => {
  try {
    const { data } = await axios.get(`https://server-izitax.analytia.pe/api/v1/claveSolAccount/${user_id}`);
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
    const { data } = await axios.post('https://server-izitax.analytia.pe/api/v1/claveSolAccount/', {
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

export const validateClaveSolAccount = async (
  user_id,
  account_id,
  ruc,
  username,
  password,
  mode
) => {
  try {
    const { data } = await axios.post('https://server-izitax.analytia.pe/api/v1/claveSolAccount/validate', {
      user_id,
      account_id,
      ruc,
      username,
      password,
      mode,
    });
    return data;
  } catch (error) {
    const { response } = error;
    console.error(error);
    return response.data;
  }
};

export const deleteClaveSolAccount = async (account_id) => {
  try {
    const response = await axios.delete(
      `https://server-izitax.analytia.pe/api/v1/claveSolAccount/${account_id}`
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
    const { data } = await axios.put('https://server-izitax.analytia.pe/api/v1/claveSolAccount/', {
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
      `https://server-izitax.analytia.pe/api/v1/claveSolAccount/deleteAll/${accountIds}`
    );
    const accounts = response?.data;
    return accounts;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};
