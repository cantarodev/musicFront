import { useEffect, useState } from 'react';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { MergeDataTable } from 'src/sections/dashboard/analytics/merged-data-table';
import { reportApi } from 'src/api/reports/reportService';
import { format, subMonths } from 'date-fns';

import { useSelector } from 'react-redux';
import { PurchasesSireCards } from './purchases-sire-cards';
import { PurchasesSireFilter } from './purchases-sire-filter';
import { Box } from '@mui/material';

const Page = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account);
  const [detailsMerge, setDetailsMerge] = useState([]);
  const [relevantData, setRelevantData] = useState({
    total_sunat: 0,
    total_ple: 0,
    coincidences: 0,
    num_only_in_database: 0,
    num_only_in_s3: 0,
    coincidence_percentage: 0,
    sum_total_difference: 0,
    sum_total_database: 0,
    sum_total_ple: 0,
    discrepancy_percentage: 0,
    discrepancy_count: 0,
    total_coincidences: 0,
  });

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

  const loadData = async () => {
    const user_id = user?.user_id;

    setLoading(true);
    try {
      const response = await reportApi.getReportMissings({
        ...selectedParams,
        user_id,
      });

      const data = response?.data;

      setDetailsMerge(data?.all_results);
      setRelevantData(data?.relevant_data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setDetailsMerge([]);
    setRelevantData({
      total_sunat: 0,
      total_ple: 0,
      coincidences: 0,
      num_only_in_database: 0,
      num_only_in_s3: 0,
      coincidence_percentage: 0,
      sum_total_difference: 0,
      sum_total_database: 0,
      sum_total_ple: 0,
      discrepancy_percentage: 0,
      discrepancy_count: 0,
      total_coincidences: 0,
    });
    setSelectedParams((state) => ({ ...state, account: selectedAccount }));
  }, [selectedAccount]);

  const sourceCounts = detailsMerge.reduce((counts, item) => {
    counts[item.source] = (counts[item.source] || 0) + 1;
    return counts;
  }, {});

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      width="100%"
    >
      <PurchasesSireFilter
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        onLoadData={loadData}
        loading={loading}
      />
      <PurchasesSireCards
        title="Compras"
        loading={loading}
        relevantData={relevantData}
      />
      <MergeDataTable
        loading={loading}
        details={detailsMerge}
        sourceCounts={sourceCounts}
        onLoadData={loadData}
      />
    </Box>
  );
};

export default Page;
