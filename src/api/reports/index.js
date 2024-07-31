import { wait } from 'src/utils/wait';

import { getReportStatus, getReportDetails } from './data';

class ReportApi {
  async getReportStatus(request) {
    const { user_id } = request;
    await wait(1000);
    return new Promise((resolve, reject) => {
      try {
        getReportStatus(user_id).then((data) => {
          resolve(data);
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async getReportDetails(request) {
    const { user_id, period, type, page, pageSize } = request;
    await wait(1000);
    return new Promise((resolve, reject) => {
      try {
        getReportDetails(user_id, period, type, page, pageSize).then((data) => {
          resolve(data);
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const reportApi = new ReportApi();
