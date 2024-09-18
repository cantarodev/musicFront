import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { AnalyticsDetails } from 'src/sections/dashboard/analytics/analytics-details';
import { reportApi } from 'src/api/reports/reportService';
import { format, subMonths } from 'date-fns';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { SalesInconsistenciesCards } from 'src/sections/dashboard/analytics/sales-inconsistencies-cards';
import { SalesInconsistenciesFilter } from './sales-inconsistencies-filter';

const Page = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account);
  const [detailsMain, setDetailsMain] = useState([]);
  const [downloadPath, setDownloadPath] = useState('');

  const [loading, setLoading] = useState(false);

  const user = useMockedUser();

  const [selectedParams, setSelectedParams] = useState({
    period: format(subMonths(new Date(), 1), 'yyyyMM'),
    account: selectedAccount,
    queryType: String(type).toLowerCase(),
    docType: 'all',
    currency: 'all',
    filters: {},
    factoringStatuses: [],
  });

  const [totalSums, setTotalSums] = useState({
    baseIGravadaDG: 0.0,
    baseIGravadaDGNG: 0.0,
    baseIGravadaDNG: 0.0,
    igv: 0.0,
    igvSunat: 0.0,
    importe: 0.0,
    importeSunat: 0.0,
    resumenGeneral: 0,
    resumenTC: 0,
  });

  const handleApplyFilters = async () => {
    const user_id = user?.user_id;

    setDetailsMain([]);
    setLoading(true);
    try {
      const response = await reportApi.reportObservations({
        ...selectedParams,
        user_id,
      });

      const data = response?.data;
      console.log(data);

      setDetailsMain(data?.all_results);
      setDownloadPath(data?.download_path);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDownloadObservations = async () => {
    try {
      const response = await reportApi.downloadObservations({
        downloadPath,
      });

      const fileResponse = await axios.get(response.data, {
        responseType: 'blob',
      });

      const blob = new Blob([fileResponse.data], { type: fileResponse.data.type });

      const fileName = downloadPath.split('/').pop();
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, '');
      const newFileName = fileName.replace('.xlsx', `_${formattedDate}.xlsx`);

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', newFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setDetailsMain([]);
    setSelectedParams((state) => ({ ...state, account: selectedAccount }));
  }, [selectedAccount]);

  useEffect(() => {
    const tcRegex = /Valor TC: [\d.]+ \(debería ser [\d.]+\)/;
    const importeRegex = /Valor Importe: [\d.]+ \(debería ser [\d.]+\)/;
    const igvRegex = /Valor IGV: [\d.]+ \(debería ser [\d.]+\)/;

    const newTotals = detailsMain.reduce(
      (totals, detail) => {
        totals.baseIGravadaDG += parseFloat(detail.mtoBIGravadaDG) || 0;
        totals.baseIGravadaDGNG += parseFloat(detail.mtoBIGravadaDGNG) || 0;
        totals.baseIGravadaDNG += parseFloat(detail.mtoBIGravadaDNG) || 0;
        totals.igv += parseFloat(detail.mtoIGV) || 0;
        totals.igvSunat += parseFloat(detail.mtoIGVSunat) || 0;
        totals.importe += parseFloat(detail.mtoImporteTotal) || 0;
        totals.importeSunat += parseFloat(detail.mtoImporteTotalSunat) || 0;

        if (tcRegex.test(detail.observacion)) {
          totals.resumenTC += 1;
        }

        if (importeRegex.test(detail.observacion) || igvRegex.test(detail.observacion)) {
          totals.resumenGeneral += 1;
        }

        return totals;
      },
      {
        baseIGravadaDG: 0.0,
        baseIGravadaDGNG: 0.0,
        baseIGravadaDNG: 0.0,
        igv: 0.0,
        igvSunat: 0.0,
        importe: 0.0,
        importeSunat: 0.0,
        resumenTC: 0,
        resumenGeneral: 0,
      }
    );

    setTotalSums(newTotals);
  }, [detailsMain]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <SalesInconsistenciesFilter
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        onLoadData={handleApplyFilters}
        loading={loading}
      />
      <SalesInconsistenciesCards
        title={type}
        totalInconsistencies={detailsMain.length || 0}
        totalSums={totalSums}
        loading={loading}
      />
      <AnalyticsDetails
        loading={loading}
        details={detailsMain || []}
        downloadPath={downloadPath}
        onLoadData={handleApplyFilters}
        onDownload={handleDownloadObservations}
        totalSums={totalSums}
      />
    </Box>
  );
};

export default Page;
