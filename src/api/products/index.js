import { applyPagination } from 'src/utils/apply-pagination';
import { deepCopy } from 'src/utils/deep-copy';
import { wait } from 'src/utils/wait';

import { getSolKeyAccounts, createSolKeyAccount, updateSolKeyAccount } from './data';

class ProductsApi {
  async getProducts(request = {}) {
    const { filters, page, rowsPerPage, userId } = request;
    let solKeyAccounts = deepCopy(await getSolKeyAccounts(userId));
    console.log(typeof solKeyAccounts);
    let data = solKeyAccounts;
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

  async createSolKeyAccount(request) {
    const { userId, ruc, username, password } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        createSolKeyAccount(userId, ruc, username, password).then((data) => {
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

  async updateSolKeyAccount(request) {
    const { id, ruc, username, password } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        updateSolKeyAccount(id, ruc, username, password).then((data) => {
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

export const solKeyAccountsApi = new ProductsApi();
