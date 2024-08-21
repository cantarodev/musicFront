import { getReportObservations, getReportMissings } from './reportApi';

class ReportApi {
  async getReportObservations(request) {
    const { user_id, period, queryType, docType, currency } = request;

    return await getReportObservations(user_id, period, queryType, docType, currency);
  }

  async getReportMissings(request) {
    const { user_id, period, queryType, docType, currency } = request;

    return await getReportMissings(user_id, period, queryType, docType, currency);
  }
}

export const reportApi = new ReportApi();
