import { wait } from 'src/utils/wait';

import { getReportStatus, getReportDetails } from './reportApi';

class ReportApi {
  async getReportStatus(request) {
    const { user_id } = request;
    return await getReportStatus(user_id);
  }

  async getReportDetails(request) {
    const { user_id, period, queryType, page, pageSize } = request;
    return await getReportDetails(user_id, period, queryType, page, pageSize);
  }
}

export const reportApi = new ReportApi();
