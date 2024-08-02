import { applyPagination } from 'src/utils/apply-pagination';
import { deepCopy } from 'src/utils/deep-copy';
import { wait } from 'src/utils/wait';

import {
  getClaveSolAccounts,
  createClaveSolAccount,
  deleteClaveSolAccount,
  deleteClaveSolAccounts,
  updateClaveSolAccount,
  validateClaveSolAccount,
} from './data';

class ClaveSolAccountsApi {
  async getClaveSolAccounts(request = {}) {
    const { filters, page, rowsPerPage, user_id } = request;

    let claveSolAccounts = deepCopy(await getClaveSolAccounts(user_id));
    let data = claveSolAccounts;
    let count = data.length;

    if (typeof filters !== 'undefined') {
      data = data.filter((claveSol) => {
        if (typeof filters.query !== 'undefined' && filters.query !== '') {
          let queryMatched = false;
          const properties = ['name', 'ruc'];

          properties.forEach((property) => {
            if (claveSol[property].toLowerCase().includes(filters.query.toLowerCase())) {
              queryMatched = true;
            }
          });

          if (!queryMatched) {
            return false;
          }
        }

        if (typeof filters.user_id !== 'undefined') {
          if (claveSol.user_id !== filters.user_id) {
            return false;
          }
        }

        // It is possible to select multiple status options
        if (typeof filters.status !== 'undefined' && filters.status.length > 0) {
          const statusMatched = filters.status.includes(claveSol.status);

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

  async createClaveSolAccount(request) {
    const { account_id, user_id, verified, name, ruc, username, password } = request;
    console.log(user_id);
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        if (account_id) {
          updateClaveSolAccount(account_id, verified, name, ruc, username, password).then(
            (data) => {
              if (data.status !== 'SUCCESS') {
                reject(new Error(data.message));
                return;
              }

              resolve(data);
            }
          );
        } else {
          createClaveSolAccount(user_id, verified, name, ruc, username, password).then((data) => {
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

  async validateClaveSolAccount(request) {
    const { user_id, account_id, ruc, username, password, mode } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        validateClaveSolAccount(user_id, account_id, ruc, username, password, mode).then((data) => {
          resolve(data);
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async deleteClaveSolAccount(request) {
    const { account_id } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        deleteClaveSolAccount(account_id).then((data) => {
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

  async updateClaveSolAccount(request) {
    const { account_id, name, ruc, username, password } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        updateClaveSolAccount(account_id, name, ruc, username, password).then((data) => {
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

  async deleteClaveSolAccounts(request) {
    const { accountIds } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        deleteClaveSolAccounts(accountIds).then((data) => {
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
}

export const claveSolAccountsApi = new ClaveSolAccountsApi();