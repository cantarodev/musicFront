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
import { PurchasesInconsistenciesFilter } from './purchases-inconsistencies-filter';

import { useDispatch } from 'react-redux';
import { setSalesReport, resetSalesReport } from '../../../slices/report';
import { useLocalStorage } from 'src/hooks/use-local-storage';

const Page = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account);
  const [downloadPath, setDownloadPath] = useState('');

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const user = useMockedUser();
  const [filters, setFilters] = useLocalStorage('filters');
  const [selectedParams, setSelectedParams] = useState({
    period: filters.period,
    account: selectedAccount,
    queryType: String(type).toLowerCase(),
    docType: 'all',
    currency: 'all',
    filters: { all: [] },
  });

  const handleApplyFilters = async () => {
    const user_id = user?.user_id;

    dispatch(resetSalesReport());
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

      dispatch(setSalesReport(data));
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
    setSelectedParams((state) => ({ ...state, account: selectedAccount }));
  }, [selectedAccount]);

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
        type="sales"
      />
      <SalesInconsistenciesCards
        title={type}
        loading={loading}
      />
      <SalesInconsistenciesDetails
        loading={loading}
        downloadPath={downloadPath}
        onLoadData={handleApplyFilters}
        onDownload={handleDownloadObservations}
        params={selectedParams}
      />
    </Box>
  );
};

export default Page;
