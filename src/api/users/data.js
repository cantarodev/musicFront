import axios from 'axios';

export const getUsers = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/v1/user`);
    const users = JSON.parse(data.users);
    return users;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const deleteUser = async (email) => {
  try {
    console.log(email);
    const response = await axios.delete(`http://localhost:5000/api/v1/user/${email}`);
    const user = response?.data;
    return user;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const updateUser = async (avatar, email, businessName, password) => {
  try {
    const { data } = await axios.put('http://localhost:5000/api/v1/user/', {
      avatar,
      email,
      businessName,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};
