import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { SalesInconsistenciesDetails } from 'src/sections/dashboard/analytics/sales-inconsistencies-details';
import { reportApi } from 'src/api/reports/reportService';

import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { useDispatch } from 'react-redux';
import { setSalesReport, resetSalesReport } from '../../../slices/report';
import { useLocalStorage } from 'src/hooks/use-local-storage';
import { ObservationFilters } from './observation-filters';
import { ObservationCards } from './observation-cards';

const Page = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account);
  const [filePath, setFilePath] = useState('');

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
      setFilePath(response?.filePath);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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
      <ObservationFilters
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        onLoadData={handleApplyFilters}
        loading={loading}
        type={type}
      />
      <ObservationCards
        type={type}
        loading={loading}
      />
      <SalesInconsistenciesDetails
        loading={loading}
        filePath={filePath}
        onLoadData={handleApplyFilters}
        params={selectedParams}
      />
    </Box>
  );
};

export default Page;
