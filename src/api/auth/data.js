import axios from 'axios';

// export const users = [
//   {
//     id: '5e86809283e28b96d2d38537',
//     avatar: '/assets/avatars/avatar-anika-visser.png',
//     email: 'demo@devias.io',
//     name: 'Anika Visser',
//     password: 'Password123!',
//     plan: 'Premium',
//   },
// ];

export const getUser = async (email, password) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/user/info', {
      email,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const createUser = async (
  name,
  lastname,
  dni,
  phone,
  business_name,
  ruc,
  email,
  password
) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/user/', {
      name,
      lastname,
      dni,
      phone,
      business_name,
      ruc,
      email,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const verifyAccount = async (user_id, token) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/user/verify/${user_id}/${token}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (email, redirectUrl) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/user/requestPasswordReset', {
      email,
      redirectUrl,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (userId, resetString, newPassword) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/user/resetPassword', {
      userId,
      resetString,
      newPassword,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const verifyLink = async (userId, resetString) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/user/verifyLink/${userId}/${resetString}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
