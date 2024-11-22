import { applyPagination } from 'src/utils/apply-pagination';
import { applySort } from 'src/utils/apply-sort';

import {
  createFile,
  getFiles,
  getTotals,
  deleteFile,
  downloadFile,
  searchComprobante,
} from './fileApi';

class FileManagerApi {
  async createFile(request) {
    const formData = request;
    return createFile(formData);
  }

  async getTotals(request) {
    const { user_id, rucAccount } = request;
    return await getTotals(user_id, rucAccount);
  }

  async getFiles(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir, user_id, rucAccount, year, type } =
      request;

    let { data } = await getFiles(user_id, rucAccount, year, type);
    let count = data.length;

    if (typeof filters !== 'undefined') {
      data = data?.filter((file) => {
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

    if (sortBy && sortDir) {
      data = applySort(data, sortBy, sortDir);
    }

    if (page && rowsPerPage) {
      data = applyPagination(data, page, rowsPerPage);
    }

    return { data, count };
  }

  async deleteFile(request = {}) {
    const { user_id, file_id } = request;
    return deleteFile(user_id, file_id);
  }

  async downloadFile(request = {}) {
    const { user_id, file_id } = request;
    return downloadFile(user_id, file_id);
  }

  async searchComprobante(request = {}) {
    const { user_id, file_id, comprobante } = request;
    console.log('FILE SERVICE: ', user_id, file_id, comprobante);
    return searchComprobante(user_id, file_id, comprobante);
  }
}

export const fileManagerApi = new FileManagerApi();
