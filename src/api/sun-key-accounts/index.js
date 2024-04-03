import { applyPagination } from 'src/utils/apply-pagination';
import { deepCopy } from 'src/utils/deep-copy';
import { wait } from 'src/utils/wait';

import {
  getSunKeyAccounts,
  createSunKeyAccount,
  deleteSunKeyAccount,
  updateSunKeyAccount,
} from './data';

class SunKeyAccountsApi {
  async getSunKeyAccounts(request = {}) {
    const { filters, page, rowsPerPage, userId } = request;
    let sunKeyAccounts = deepCopy(await getSunKeyAccounts(userId));
    let data = sunKeyAccounts;
    let count = data.length;

    if (typeof filters !== 'undefined') {
      data = data.filter((product) => {
        if (typeof filters.username !== 'undefined' && filters.username !== '') {
          const usernameMatched = product.username
            .toLowerCase()
            .includes(filters.username.toLowerCase());

          if (!usernameMatched) {
            return false;
          }
        }

        // It is possible to select multiple status options
        if (typeof filters.status !== 'undefined' && filters.status.length > 0) {
          const statusMatched = filters.status.includes(product.status);

          if (!statusMatched) {
            return false;
          }
        }

        return true;
      });
      count = data.length;
    }

    if (typeof page !== 'undefined' && typeof rowsPerPage !== 'undefined') {
      data = applyPagination(data, page, rowsPerPage);
    }

    return Promise.resolve({
      data,
      count,
    });
  }

  async createSunKeyAccount(request) {
    const { id, userId, ruc, username, password } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        if (id) {
          updateSunKeyAccount(id, ruc, username, password).then((data) => {
            if (data.status !== 'SUCCESS') {
              reject(new Error(data.message));
              return;
            }

            resolve(data);
          });
        } else {
          createSunKeyAccount(userId, ruc, username, password).then((data) => {
            if (data.status !== 'SUCCESS') {
              reject(new Error(data.message));
              return;
            }

            resolve(data);
          });
        }
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async deleteSunKeyAccount(request) {
    const { sunKeyId } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        deleteSunKeyAccount(sunKeyId).then((data) => {
          if (!data?.status) {
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

  async updateSunKeyAccount(request) {
    const { id, ruc, username, password } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        updateSunKeyAccount(id, ruc, username, password).then((data) => {
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

export const sunKeyAccountsApi = new SunKeyAccountsApi();
