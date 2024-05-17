import { applyPagination } from 'src/utils/apply-pagination';
import { applySort } from 'src/utils/apply-sort';
import { deepCopy } from 'src/utils/deep-copy';
import { wait } from 'src/utils/wait';

import {
  getUsers,
  deleteUser,
  deletAllUsers,
  changeStatusUser,
  downloadUsers,
  updateUser,
} from './data';

class UsersApi {
  async getUsers(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir } = request;

    let data = deepCopy(await getUsers());
    let count = data.length;

    if (typeof filters !== 'undefined') {
      data = data.filter((user) => {
        if (typeof filters.query !== 'undefined' && filters.query !== '') {
          let queryMatched = false;
          const properties = ['email', 'businessName'];

          properties.forEach((property) => {
            if (user[property].toLowerCase().includes(filters.query.toLowerCase())) {
              queryMatched = true;
            }
          });

          if (!queryMatched) {
            return false;
          }
        }

        if (typeof filters.active !== 'undefined') {
          if (user.status !== filters.active) {
            return false;
          }
        }

        if (typeof filters.inactive !== 'undefined') {
          if (user.status !== filters.inactive) {
            return false;
          }
        }

        if (typeof filters.pending !== 'undefined') {
          if (user.status !== filters.pending) {
            return false;
          }
        }

        return true;
      });
      count = data.length;
    }

    if (typeof sortBy !== 'undefined' && typeof sortDir !== 'undefined') {
      data = applySort(data, sortBy, sortDir);
    }

    if (typeof page !== 'undefined' && typeof rowsPerPage !== 'undefined') {
      data = applyPagination(data, page, rowsPerPage);
    }

    return Promise.resolve({
      data,
      count,
    });
  }

  async deleteUser(request) {
    const { email } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        deleteUser(email).then((data) => {
          if (!data?.message) {
            reject(new Error('Por favor, inténtalo más tarde.'));
            return;
          }

          resolve(data);
        });
      } catch (err) {
        reject(new Error('Internal server error'));
      }
    });
  }

  async deletAllUsers(request) {
    const { userIds } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        deletAllUsers(userIds).then((data) => {
          if (!data?.message) {
            reject(new Error('Por favor, inténtalo más tarde.'));
            return;
          }

          resolve(data);
        });
      } catch (err) {
        reject(new Error('Internal server error'));
      }
    });
  }

  async changeStatusUser(request) {
    const { email, status } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        changeStatusUser(email, status).then((data) => {
          if (!data?.message) {
            reject(new Error('Por favor, inténtalo más tarde.'));
            return;
          }

          resolve(data);
        });
      } catch (err) {
        reject(new Error('Internal server error'));
      }
    });
  }

  async downloadUsers() {
    await wait(500);
    return new Promise((resolve, reject) => {
      try {
        downloadUsers().then((resp) => {
          console.log('a', resp);
          resolve(resp);
        });
      } catch (err) {
        reject(new Error('Internal server error'));
      }
    });
  }

  async updateUser(request) {
    const { avatar, email, name, lastname, password } = request;
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        updateUser(avatar, email, name, lastname, password).then((data) => {
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

export const usersApi = new UsersApi();
