import { applyPagination } from 'src/utils/apply-pagination';
import { applySort } from 'src/utils/apply-sort';
import { deepCopy } from 'src/utils/deep-copy';

import { solKeyAccount, solKeyAccounts, emails, invoices, logs } from './data';

class SolKeyAccountsApi {
  getSolKeyAccounts(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir } = request;

    let data = deepCopy(solKeyAccounts);
    let count = data.length;

    if (typeof filters !== 'undefined') {
      data = data.filter((solKeyAccount) => {
        if (typeof filters.query !== 'undefined' && filters.query !== '') {
          let queryMatched = false;
          const properties = ['email', 'name'];

          properties.forEach((property) => {
            if (solKeyAccount[property].toLowerCase().includes(filters.query.toLowerCase())) {
              queryMatched = true;
            }
          });

          if (!queryMatched) {
            return false;
          }
        }

        if (typeof filters.hasAcceptedMarketing !== 'undefined') {
          if (solKeyAccount.hasAcceptedMarketing !== filters.hasAcceptedMarketing) {
            return false;
          }
        }

        if (typeof filters.isProspect !== 'undefined') {
          if (solKeyAccount.isProspect !== filters.isProspect) {
            return false;
          }
        }

        if (typeof filters.isReturning !== 'undefined') {
          if (solKeyAccount.isReturning !== filters.isReturning) {
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

  getSolKeyAccount(request) {
    return Promise.resolve(deepCopy(solKeyAccount));
  }

  getEmails(request) {
    return Promise.resolve(deepCopy(emails));
  }

  getInvoices(request) {
    return Promise.resolve(deepCopy(invoices));
  }

  getLogs(request) {
    return Promise.resolve(deepCopy(logs));
  }
}

export const solKeyAccountsApi = new SolKeyAccountsApi();
