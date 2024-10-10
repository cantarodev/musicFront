import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { PurchasesInconsistenciesDetails } from 'src/sections/dashboard/analytics/purchases-inconsistencies-details';
import { reportApi } from 'src/api/reports/reportService';
import { format, subMonths } from 'date-fns';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { PurchasesInconsistenciesCards } from 'src/sections/dashboard/analytics/purchases-inconsistencies-cards';
import { PurchasesInconsistenciesFilter } from './purchases-inconsistencies-filter';
import toast from 'react-hot-toast';

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
    baseIGravada: 0.0,
    baseIGravadaDGNG: 0.0,
    baseIGravadaDNG: 0.0,
    igv: 0.0,
    igvSunat: 0.0,
    importe: 0.0,
    importeSunat: 0.0,
    observacionTC: 0,
    observacionFacto: 0,
    observacionIncons: 0,
    observacionCpe: 0,
    observacionCond: 0,
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
      if (response?.status === 'failed') {
        toast.error(response?.message, {
          duration: 5000,
          position: 'top-right',
        });
      }

      setDetailsMain(data);
      setDownloadPath(response?.download_path);
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
    const newTotals = detailsMain.reduce(
      (totals, detail) => {
        totals.baseIGravada += parseFloat(detail.mtoBIGravada) || 0;
        totals.baseIGravadaDGNG += parseFloat(detail.mtoBIGravadaDGNG) || 0;
        totals.baseIGravadaDNG += parseFloat(detail.mtoBIGravadaDNG) || 0;
        totals.igv += parseFloat(detail.mtoIGV) || 0;
        totals.igvSunat += parseFloat(detail.igvSunat) || 0;
        totals.importe += parseFloat(detail.importeTotal) || 0;
        totals.importeSunat += parseFloat(detail.importeTotalSunat) || 0;

        if (detail.observacion['tc'].length > 0) {
          totals.observacionTC += 1;
        }

        if (detail.observacion['facto'].length > 0) {
          totals.observacionFacto += 1;
        }

        if (detail.observacion['incons'].length > 0) {
          totals.observacionIncons += 1;
        }

        if (detail.observacion['cpe'].length > 0) {
          totals.observacionCpe += 1;
        }

        if (detail.observacion['cond'].length > 0) {
          totals.observacionCond += 1;
        }

        return totals;
      },
      {
        baseIGravada: 0.0,
        baseIGravadaDGNG: 0.0,
        baseIGravadaDNG: 0.0,
        igv: 0.0,
        igvSunat: 0.0,
        importe: 0.0,
        importeSunat: 0.0,
        observacionTC: 0,
        observacionFacto: 0,
        observacionIncons: 0,
        observacionCpe: 0,
        observacionCond: 0,
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
      <PurchasesInconsistenciesFilter
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        onLoadData={handleApplyFilters}
        loading={loading}
      />
      <PurchasesInconsistenciesCards
        title={type}
        totalInconsistencies={detailsMain.length || 0}
        totalSums={totalSums}
        loading={loading}
      />
      <PurchasesInconsistenciesDetails
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
