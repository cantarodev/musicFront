import {
  reportObservations,
  getReportMissings,
  downloadObservations,
  downloadObservationsExcel,
  downloadMissingsExcel,
  getReportDetractions,
  getReportDebitCreditNotes,
  getReportCorrelativity,
  getReportFactoring,
} from './reportApi';

class ReportApi {
  async reportObservations(request) {
    const { user_id, period, queryType, docType, currency, filters, account, factoringStatuses } =
      request;

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

  async getReportDetractions(request) {
    const { user_id, period, queryType, docType, currency, filters, account } = request;

    return await getReportDetractions(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account
    );
  }

  async getReportDebitCreditNotes(request) {
    const { user_id, period, queryType, docType, currency, filters, account } = request;

    return await getReportDebitCreditNotes(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account
    );
  }

  async getReportFactoring(request) {
    const { user_id, period, queryType, docType, currency, filters, account } = request;

    return await getReportFactoring(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account
    );
  }

  async getReportCorrelativity(request) {
    const { user_id, period, queryType, docType, currency, filters, account } = request;

    return await getReportCorrelativity(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account
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

  async downloadObservationsExcel(request) {
    const { params, filteredData, filePath } = request;
    return await downloadObservationsExcel(params, filteredData, filePath);
  }

  async downloadMissingsExcel(request) {
    const { filteredData, filePath } = request;
    return await downloadMissingsExcel(filteredData, filePath);
  }
}

export const reportApi = new ReportApi();
