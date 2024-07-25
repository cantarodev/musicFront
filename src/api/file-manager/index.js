import { applyPagination } from 'src/utils/apply-pagination';
import { applySort } from 'src/utils/apply-sort';
import { deepCopy } from 'src/utils/deep-copy';
import { wait } from 'src/utils/wait';

import { createFile, getFiles, getTotals, deleteFile, downloadFile } from './data';

class FileManagerApi {
  async createFile(request) {
    const formData = request;
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        createFile(formData).then((data) => {
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

  async getTotals(request) {
    const { user_id } = request;
    await wait(1000);
    return new Promise((resolve, reject) => {
      try {
        getTotals(user_id).then((data) => {
          resolve(data);
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async getFiles(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir, user_id } = request;
    let data = deepCopy(await getFiles(user_id));
    let count = data.length;

    if (typeof filters !== 'undefined') {
      data = data.filter((file) => {
        if (typeof filters.query !== 'undefined' && filters.query !== '') {
          const matched = file.name.toLowerCase().includes(filters.query.toLowerCase());

          if (!matched) {
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

  async deleteFile(request = {}) {
    const { user_id, file_id } = request;
    await wait(500);
    return new Promise((resolve, reject) => {
      try {
        deleteFile(user_id, file_id).then((data) => {
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

  async downloadFile(request = {}) {
    const { user_id, file_id } = request;
    await wait(500);
    return new Promise((resolve, reject) => {
      try {
        downloadFile(user_id, file_id).then((data) => {
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
}

export const fileManagerApi = new FileManagerApi();
