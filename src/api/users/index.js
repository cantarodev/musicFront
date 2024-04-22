import { applyPagination } from 'src/utils/apply-pagination';
import { applySort } from 'src/utils/apply-sort';
import { deepCopy } from 'src/utils/deep-copy';
import { wait } from 'src/utils/wait';

import { getUsers, deleteUser, updateUser } from './data';

class UsersApi {
  async getUsers(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir } = request;
    console.log(await getUsers());
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

        if (typeof filters.hasAcceptedMarketing !== 'undefined') {
          if (user.hasAcceptedMarketing !== filters.hasAcceptedMarketing) {
            return false;
          }
        }

        if (typeof filters.isProspect !== 'undefined') {
          if (user.isProspect !== filters.isProspect) {
            return false;
          }
        }

        if (typeof filters.isReturning !== 'undefined') {
          if (user.isReturning !== filters.isReturning) {
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

export const usersApi = new UsersApi();
