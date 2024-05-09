import { createResourceId } from 'src/utils/create-resource-id';
import axios from 'axios';
import { decode, JWT_EXPIRES_IN, JWT_SECRET, sign } from 'src/utils/jwt';
import { wait } from 'src/utils/wait';

import { getUser, createUser } from './data';

class AuthApi {
  async signIn(request) {
    const { email, password } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        getUser(email, password).then((data) => {
          if (!data?.user) {
            reject(new Error(data.message));
            return;
          }

          const accessToken = sign({ userId: data.user.user_id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
          });
          resolve({ accessToken });
        });
      } catch (err) {
        reject(new Error('Internal server error'));
      }
    });
  }

  async signUp(request) {
    const { name, lastname, dni, phone, business_name, ruc, email, password } = request;

    await wait(1000);
    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        createUser(name, lastname, dni, phone, business_name, ruc, email, password).then((data) => {
          if (!data?.user) {
            reject(new Error(data.message));
            return;
          }

          resolve(data.user);
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async me(request) {
    const { accessToken } = request;

    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        const decodedToken = decode(accessToken);

        // Find the user
        const { userId } = decodedToken;
        axios.get(`http://localhost:5000/api/v1/user/me/${userId}`).then(({ data }) => {
          if (!data.user) {
            reject(new Error('Invalid authorization token'));
            return;
          }
          const user = JSON.parse(data.user);
          resolve({
            user_id: user.user_id,
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role_id: user.role_id,
          });
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
