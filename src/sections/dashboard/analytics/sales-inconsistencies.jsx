import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { SalesInconsistenciesDetails } from 'src/sections/dashboard/analytics/sales-inconsistencies-details';
import { reportApi } from 'src/api/reports/reportService';
import { format, subMonths } from 'date-fns';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { SalesInconsistenciesCards } from 'src/sections/dashboard/analytics/sales-inconsistencies-cards';
import { SalesInconsistenciesFilter } from './sales-inconsistencies-filter';
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
    igv: 0.0,
    igvSunat: 0.0,
    importe: 0.0,
    importeSunat: 0.0,
    observacionGeneral: 0,
    observacionTC: 0,
    observacionFacto: 0,
    observacionIncons: 0,
    observacionCpe: 0,
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
      if (data.status === 'failed') {
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
        totals.igv += parseFloat(detail.mtoIGV) || 0;
        totals.igvSunat += parseFloat(detail.mtoIGVSunat) || 0;
        totals.importe += parseFloat(detail.mtoImporteTotal) || 0;
        totals.importeSunat += parseFloat(detail.mtoImporteTotalSunat) || 0;

        if (detail.observacion['general'].length > 0) {
          totals.observacionGeneral += 1;
        }

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

        return totals;
      },
      {
        baseIGravada: 0.0,
        igv: 0.0,
        igvSunat: 0.0,
        importe: 0.0,
        importeSunat: 0.0,
        observacionTC: 0,
        observacionGeneral: 0,
        observacionFacto: 0,
        observacionIncons: 0,
        observacionCpe: 0,
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
      <SalesInconsistenciesDetails
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
