import { getReportObservations, getReportMissings, downloadObservations } from './reportApi';

class ReportApi {
  async getReportObservations(request) {
    const { user_id, period, queryType, docType, currency } = request;

    return await getReportObservations(user_id, period, queryType, docType, currency);
  }

  async getReportMissings(request) {
    const { user_id, period, queryType, docType, currency } = request;

    return await getReportMissings(user_id, period, queryType, docType, currency);
  }

  async downloadObservations(request) {
    const { downloadPath } = request;
    return await downloadObservations(downloadPath);
  }
}

export const reportApi = new ReportApi();
