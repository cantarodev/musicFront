import { wait } from 'src/utils/wait';

import { deleteUser, updateUser } from './data';

class UserApi {
  async delete(request) {
    const { email } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        deleteUser(email).then((data) => {
          if (!data?.message) {
            reject(new Error('Por favor, inténtalo más tarde.'));
            return;
          }

          resolve(data.message);
        });
      } catch (err) {
        reject(new Error('Internal server error'));
      }
    });
  }

  async updateUser(request) {
    const { avatar, email, businessName, password } = request;
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        updateUser(avatar, email, businessName, password).then((data) => {
          if (data.status !== 'SUCCESS') {
            reject(new Error(data.message));
            return;
          }

          resolve(data);
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const userApi = new UserApi();
