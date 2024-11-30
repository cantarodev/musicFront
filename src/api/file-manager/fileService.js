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
    const { user_id, rucAccount, option } = request;
    return await getTotals(user_id, rucAccount, option);
  }

  async getFiles(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir, user_id, rucAccount, option, year, type } =
      request;

    let { data } = await getFiles(user_id, rucAccount, option, year, type);
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
    const { user_id, file_id, option } = request;
    return deleteFile(user_id, file_id, option);
  }

  async downloadFile(request = {}) {
    const { user_id, file_id, option } = request;
    return downloadFile(user_id, file_id, option);
  }

  async searchComprobante(request = {}) {
    const { user_id, file_id, comprobante } = request;
    console.log('FILE SERVICE: ', user_id, file_id, comprobante);
    return searchComprobante(user_id, file_id, comprobante);
  }
}

export const fileManagerApi = new FileManagerApi();
