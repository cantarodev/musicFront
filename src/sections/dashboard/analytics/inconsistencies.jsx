import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { PurchasesInconsistenciesDetails } from 'src/sections/dashboard/analytics/purchases-inconsistencies-details';
import { reportApi } from 'src/api/reports/reportService';

import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { useDispatch } from 'react-redux';
import {
  setPurchasesReport,
  setSalesReport,
  resetPurchasesReport,
  resetSalesReport,
} from '../../../slices/report';
import { useLocalStorage } from 'src/hooks/use-local-storage';
import { ObservationFilters } from './observation-filters';
import { ObservationCards } from './observation-cards';
import { SalesInconsistenciesDetails } from './sales-inconsistencies-details';

const Page = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account);
  const [filePath, setFilePath] = useState('');
  const setReport =
    type === 'Compras'
      ? setPurchasesReport
      : type === 'Ventas'
        ? setSalesReport
        : () => console.warn('Tipo no válido');
  const resetReport =
    type === 'Compras'
      ? resetPurchasesReport
      : type === 'Ventas'
        ? resetSalesReport
        : () => console.warn('Tipo no válido');

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

    dispatch(resetReport());
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

      dispatch(setReport(data));
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
        type={type}
      />
      <ObservationCards
        type={type}
        loading={loading}
      />
      {type === 'Compras' ? (
        <PurchasesInconsistenciesDetails
          loading={loading}
          filePath={filePath}
          onLoadData={handleApplyFilters}
          params={selectedParams}
        />
      ) : (
        <SalesInconsistenciesDetails
          loading={loading}
          filePath={filePath}
          onLoadData={handleApplyFilters}
          params={selectedParams}
        />
      )}
    </Box>
  );
};

export default Page;
