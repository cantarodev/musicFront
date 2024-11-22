import { useEffect, useState } from 'react';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { MergeDataTable } from 'src/sections/dashboard/analytics/merged-data-table';
import { reportApi } from 'src/api/reports/reportService';
import { setMissingsReport, resetMissingsReport } from '../../../slices/report';

import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { MissingCards } from './missing-cards';
import { ObservationFilters } from './observation-filters';
import { useDispatch } from 'react-redux';
import { useLocalStorage } from 'src/hooks/use-local-storage';

const Page = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account);
  const [relevantData, setRelevantData] = useState({});

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

  const loadData = async () => {
    const user_id = user?.user_id;

    dispatch(resetMissingsReport());
    setLoading(true);
    try {
      const response = await reportApi.getReportMissings({
        ...selectedParams,
        user_id,
      });

      const data = response?.data;

      dispatch(setMissingsReport(data?.allResults));
      setRelevantData(data?.relevantData);
      setFilePath(data?.filePath);
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
      width="100%"
    >
      <ObservationFilters
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        onLoadData={loadData}
        loading={loading}
        hide={['filters']}
        type="Faltantes"
      />
      <MissingCards
        type={type}
        loading={loading}
        relevantData={relevantData}
      />
      <MergeDataTable
        loading={loading}
        params={selectedParams}
      />
    </Box>
  );
};

export default Page;
