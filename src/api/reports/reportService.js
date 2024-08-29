import { reportObservations, getReportMissings, downloadObservations } from './reportApi';

class ReportApi {
  async reportObservations(request) {
    const { user_id, period, queryType, docType, currency, filters } = request;

    return await reportObservations(user_id, period, queryType, docType, currency, filters);
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
