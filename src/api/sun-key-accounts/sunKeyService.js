import { applyPagination } from 'src/utils/apply-pagination';

import {
  getClaveSolAccounts,
  createClaveSolAccount,
  deleteClaveSolAccount,
  deleteClaveSolAccounts,
  updateClaveSolAccount,
  validateClaveSolAccount,
} from './sunKeyApi';

class ClaveSolAccountsApi {
  async getClaveSolAccounts(request = {}) {
    const { filters, page, rowsPerPage, user_id } = request;

    let { data } = await getClaveSolAccounts(user_id);
    let count = data.length;

    if (filters) {
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

    if (page && rowsPerPage) {
      data = applyPagination(data, page, rowsPerPage);
    }

    return { data, count };
  }

  async createClaveSolAccount(request) {
    const { account_id, user_id, verified, name, ruc, username, password } = request;
    if (account_id) {
      return await updateClaveSolAccount(
        user_id,
        account_id,
        verified,
        name,
        ruc,
        username,
        password
      );
    }
    return await createClaveSolAccount(user_id, verified, name, ruc, username, password);
  }

  async validateClaveSolAccount(request) {
    const { user_id, account_id, ruc, username, password, mode } = request;
    return validateClaveSolAccount(user_id, account_id, ruc, username, password, mode);
  }

  async deleteClaveSolAccount(request) {
    const { account_id } = request;
    return deleteClaveSolAccount(account_id);
  }

  async deleteClaveSolAccounts(request) {
    const { accountIds } = request;
    return deleteClaveSolAccounts(accountIds);
  }
}

export const claveSolAccountsApi = new ClaveSolAccountsApi();
