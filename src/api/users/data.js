import axios from 'axios';

export const getUsers = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/v1/user`);
    const users = JSON.parse(data.users);
    const newUsers = users
      .filter((user) => user.role_id != 1)
      .map((user) => {
        return user;
      });

    return newUsers;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const deleteUser = async (email) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/v1/user/${email}`);
    const user = response?.data;
    return user;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const deletAllUsers = async (userIds) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/v1/user/deleteAll/${userIds}`);
    const user = response?.data;
    return user;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const changeStatusUser = async (email, status) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/user/changeStatus/${email}/${status}`
    );
    const user = response?.data;
    return user;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const downloadUsers = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/v1/user/downloadUsers`);
    return response;
  } catch (err) {
    console.error('[Auth Api]: ', err);
  }
};

export const updateUser = async (avatar, email, name, lastname, password) => {
  try {
    const { data } = await axios.put('http://localhost:5000/api/v1/user/', {
      avatar,
      email,
      name,
      lastname,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};
