import { reportObservations, getReportMissings, downloadObservations } from './reportApi';

class ReportApi {
  async reportObservations(request) {
    const { user_id, period, queryType, docType, currency, filters, account, factoringStatuses } = request;

    return await reportObservations(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
      factoringStatuses
    );
  }

  async getReportMissings(request) {
    const { user_id, period, queryType, docType, currency, account } = request;

    return await getReportMissings(user_id, period, queryType, docType, currency, account);
  }

  async downloadObservations(request) {
    const { downloadPath } = request;
    return await downloadObservations(downloadPath);
  }
}

export const reportApi = new ReportApi();
